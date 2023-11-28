import { ResultSetHeader, RowDataPacket } from "mysql2";

import {
  CreateCategoryRepository,
  FindCategoriesRepository,
  FindCategoryRepository,
} from "../contracts/repositories/category";
import { CheckCategoryRepository } from "../contracts/repositories/category/check-category";
import { DeleteCategoryRepository } from "../contracts/repositories/category/delete-category";
import { UpdateCategoryRepository } from "../contracts/repositories/category/update-category";
import { db } from "../lib/mysql";
import { Category, CategoryWithoutBillboard } from "../models/category";

export class CategoryRepository
  implements
    CreateCategoryRepository,
    FindCategoryRepository,
    FindCategoriesRepository,
    DeleteCategoryRepository,
    UpdateCategoryRepository,
    CheckCategoryRepository
{
  async create({ billboardId, name, storeId }: CreateCategoryRepository.Input): Promise<Category> {
    const [insertResult] = await db.execute<ResultSetHeader>(
      `
              INSERT INTO CATEGORIA(cat_nome, cod_capa, cod_loja) 
              VALUES (?, ?, ?)
            `,
      [name, billboardId, storeId],
    );
    const categoryId = insertResult.insertId;
    return this.findOne({ id: categoryId, storeId }) as Promise<Category>;
  }

  async update({ categoryId, billboardId, name, storeId }: UpdateCategoryRepository.Input): Promise<Category> {
    await db.execute<ResultSetHeader>(
      `
        UPDATE CATEGORIA 
        SET cat_nome=?, cod_capa=? 
        WHERE cat_cod=? AND cod_loja=?;
      `,
      [name, billboardId, categoryId, storeId],
    );
    return this.findOne({ id: categoryId, storeId }) as Promise<Category>;
  }

  async findOne(input: FindCategoryRepository.Input): Promise<Category | null> {
    let query = ` 
    SELECT CT.*, CP.capa_texto, CP.capa_url_imagem  
    FROM CATEGORIA CT
    JOIN CAPA CP ON CP.capa_cod=CT.cod_capa
    WHERE `;

    const queryParams: (number | string)[] = [];
    if (input.id) {
      query += " cat_cod=? AND CT.cod_loja=?;";
      queryParams.push(input.id, input.storeId);
    } else if (input.name) {
      query += " cat_nome=? AND CT.cod_loja=?;";
      queryParams.push(input.name, input.storeId);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    if (rows.length <= 0) return null;
    const rawCategory = rows[0] as RawCategory;
    return this.mapRowToCategory(rawCategory);
  }

  async findMany({ storeId }: FindCategoriesRepository.Input): Promise<Category[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT CT.*, CP.capa_texto, CP.capa_url_imagem 
        FROM CATEGORIA CT
        JOIN CAPA CP ON CP.capa_cod=CT.cod_capa
        WHERE CT.cod_loja=? 
        ORDER BY data_criacao DESC;
      `,
      [storeId],
    );
    return rows.map(row => this.mapRowToCategory(row as RawCategory));
  }

  async checkBy({ billboardId, storeId }: CheckCategoryRepository.Input): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT COUNT(*) as count
        FROM CATEGORIA
        WHERE cod_capa=? AND cod_loja=?;
      `,
      [billboardId, storeId],
    );

    const count = rows[0].count;
    return count > 0;
  }
  async delete({ id }: DeleteCategoryRepository.Input): Promise<void> {
    await db.execute("DELETE FROM CATEGORIA WHERE cat_cod=?", [id]);
  }
  private mapRowToCategory(row: RawCategory): Category {
    return {
      id: row.cat_cod,
      name: row.cat_nome,
      billboard: {
        id: row.cod_capa,
        imageUrl: row.capa_url_imagem,
        label: row.capa_texto,
      },
      billboardId: row.cod_capa,
      storeId: row.cod_loja,
      createdAt: row.data_criacao,
      updatedAt: row.data_atualizacao,
    };
  }
}

export type RawCategory = {
  cat_cod: number;
  cat_nome: string;
  cod_capa: number;
  capa_texto: string;
  capa_url_imagem: string;
  cod_loja: number;
  data_criacao: Date;
  data_atualizacao: Date;
};
