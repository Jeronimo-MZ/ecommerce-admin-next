import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import {
  CreateProductRepository,
  FindProductRepository,
  FindProductsRepository,
  UpdateProductRepository,
} from "../contracts/repositories/product";
import { DeleteProductRepository } from "../contracts/repositories/product/delete-product";
import { db } from "../lib/mysql";
import { Product } from "../models/product";

export class ProductRepository
  implements
    CreateProductRepository,
    FindProductRepository,
    FindProductsRepository,
    DeleteProductRepository,
    UpdateProductRepository
{
  async create({
    name,
    storeId,
    categoryId,
    colorId,
    images,
    price,
    quantityInStock,
    sizeId,
  }: CreateProductRepository.Input): Promise<Product> {
    let connection: PoolConnection | undefined;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();
      const [insertResult] = await connection.execute<ResultSetHeader>(
        `
                  INSERT INTO 
                  PRODUTO(produto_nome, produto_preco, produto_quantidade_stock, cod_loja, cod_cor, cod_tamanho, cod_categoria) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
        [name, price, quantityInStock, storeId, colorId, sizeId, categoryId],
      );
      const productId = insertResult.insertId;
      const imageInsertValues = images.map(imageUrl => [productId, imageUrl]);
      await connection.execute("INSERT INTO FOTO_PRODUTO(ft_url_foto, cod_produto) VALUES ?;", [imageInsertValues]);
      await connection.commit();
      return this.findOne({ id: productId, storeId }) as Promise<Product>;
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async findOne(input: FindProductRepository.Input): Promise<Product | null> {
    let query = `
        SELECT 
            PR.*,
            CT.cat_nome as categoria, 
            TM.tam_nome as tamanho, TM.tam_abreviatura, 
            COR.cor_nome as cor, COR.cor_codigo_hexadecimal, 
            CT.cat_nome as categoria
        FROM PRODUTO PR
        JOIN CATEGORIA CT ON CT.cat_cod=PR.cod_categoria
        JOIN TAMANHO TM ON TM.tam_cod=PR.cod_tamanho
        JOIN COR ON COR.cor_cod=PR.cod_cor
        WHERE  
    `;

    const queryParams: (number | string)[] = [];
    if (input.id) {
      query += " produto_cod=? AND PR.cod_loja=?;";
      queryParams.push(input.id, input.storeId);
    } else if (input.name) {
      query += " produto_nome LIKE ? AND PR.cod_loja=?;";
      queryParams.push(input.name, input.storeId);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    if (rows.length <= 0) return null;
    const rawProduct = rows[0] as RawProduct;
    const [images] = await db.query<RowDataPacket[]>("SELECT * FROM FOTO_PRODUTO WHERE cod_produto=?", [
      rawProduct.produto_cod,
    ]);
    return {
      id: rawProduct.produto_cod,
      name: rawProduct.produto_nome,
      category: { id: rawProduct.cod_categoria, name: rawProduct.categoria },
      color: { id: rawProduct.cod_cor, name: rawProduct.cor, value: rawProduct.cor_codigo_hexadecimal },
      images: images.map(image => image.ft_url_foto),
      price: rawProduct.produto_preco,
      quantityInStock: rawProduct.produto_quantidade_stock,
      size: { id: rawProduct.cod_tamanho, name: rawProduct.tamanho, value: rawProduct.tam_abreviatura },
      storeId: rawProduct.cod_loja,
      createdAt: rawProduct.data_criacao,
      updatedAt: rawProduct.data_atualizacao,
    };
  }

  async findMany({
    storeId,
    categoryId,
    colorId,
    inStockOnly,
    sizeId,
  }: FindProductsRepository.Input): Promise<FindProductsRepository.Output> {
    let query = `
      SELECT 
          PR.*,
          CT.cat_nome as categoria, 
          TM.tam_nome as tamanho, TM.tam_abreviatura, 
          COR.cor_nome as cor, COR.cor_codigo_hexadecimal, 
          CT.cat_nome as categoria
      FROM PRODUTO PR
      JOIN CATEGORIA CT ON CT.cat_cod=PR.cod_categoria
      JOIN TAMANHO TM ON TM.tam_cod=PR.cod_tamanho
      JOIN COR ON COR.cor_cod=PR.cod_cor
      WHERE PR.cod_loja=?
    `;
    const queryParams = [storeId];

    if (categoryId) {
      query += " AND PR.cod_categoria = ?";
      queryParams.push(categoryId);
    }

    if (sizeId) {
      query += " AND PR.cod_tamanho = ?";
      queryParams.push(sizeId);
    }

    if (colorId) {
      query += " AND PR.cod_cor = ?";
      queryParams.push(colorId);
    }

    if (inStockOnly) {
      query += " AND PR.produto_quantidade_stock > 0";
    }

    query += "ORDER BY data_criacao DESC;";

    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    const products = rows as RawProduct[];
    return products.map(rawProduct => ({
      id: rawProduct.produto_cod,
      name: rawProduct.produto_nome,
      category: { id: rawProduct.cod_categoria, name: rawProduct.categoria },
      color: { id: rawProduct.cod_cor, name: rawProduct.cor, value: rawProduct.cor_codigo_hexadecimal },
      price: rawProduct.produto_preco,
      quantityInStock: rawProduct.produto_quantidade_stock,
      size: { id: rawProduct.cod_tamanho, name: rawProduct.tamanho, value: rawProduct.tam_abreviatura },
      storeId: rawProduct.cod_loja,
      createdAt: rawProduct.data_criacao,
      updatedAt: rawProduct.data_atualizacao,
    }));
  }

  async delete({ id }: DeleteProductRepository.Input): Promise<void> {
    let connection: PoolConnection | undefined;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();
      await db.execute("DELETE FROM FOTO_PRODUTO WHERE cod_produto=?", [id]);
      await db.execute("DELETE FROM PRODUTO WHERE produto_cod=?", [id]);
      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async update({
    categoryId,
    colorId,
    id,
    images,
    name,
    price,
    quantityInStock,
    sizeId,
    storeId,
  }: UpdateProductRepository.Input): Promise<Product> {
    let connection: PoolConnection | undefined;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const [productRows] = await connection.execute<ResultSetHeader>(
        `
          UPDATE PRODUTO 
          SET produto_nome=?, produto_preco=?, 
              produto_quantidade_stock=?, 
              cod_cor=?, cod_tamanho=?, cod_categoria=?
          WHERE produto_cod=? AND cod_loja=?;
        `,
        [name, price, quantityInStock, colorId, sizeId, categoryId, id, storeId],
      );
      if (productRows.affectedRows !== 1) {
        throw new Error("Product not found or update failed");
      }
      await connection.execute("DELETE FROM FOTO_PRODUTO WHERE cod_produto=?", [id]);

      const imageInsertValues = images.map(imageUrl => [imageUrl, id]);
      const q = db.format("INSERT INTO FOTO_PRODUTO(ft_url_foto, cod_produto) VALUES ?;", [imageInsertValues]);
      await connection.execute(q);

      await connection.commit();
      return this.findOne({ id, storeId }) as Promise<Product>;
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

export type RawProduct = {
  produto_cod: number;
  produto_nome: string;
  produto_preco: number;
  produto_quantidade_stock: number;
  categoria: string;
  tamanho: string;
  tam_abreviatura: string;
  cor: string;
  cor_codigo_hexadecimal: string;
  cod_loja: number;
  cod_tamanho: number;
  cod_cor: number;
  cod_categoria: number;
  moeda_usada: string;
  data_criacao: Date;
  data_atualizacao: Date;
};
