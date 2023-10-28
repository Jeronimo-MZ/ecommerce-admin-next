import { ResultSetHeader, RowDataPacket } from "mysql2";

import {
  CreateSizeRepository,
  DeleteSizeRepository,
  FindSizeRepository,
  FindSizesRepository,
  UpdateSizeRepository,
} from "../contracts/repositories/size";
import { db } from "../lib/mysql";
import { Size } from "../models/size";

export class SizeRepository
  implements CreateSizeRepository, FindSizeRepository, FindSizesRepository, DeleteSizeRepository, UpdateSizeRepository
{
  async create({ name, storeId, value }: CreateSizeRepository.Input): Promise<Size> {
    const [insertResult] = await db.execute<ResultSetHeader>(
      `
              INSERT INTO TAMANHO(tam_nome, tam_abreviatura, cod_loja) 
              VALUES (?, ?, ?)
            `,
      [name, value, storeId],
    );
    const sizeId = insertResult.insertId;
    return this.findOne({ id: sizeId, storeId }) as Promise<Size>;
  }

  async update({ sizeId, value, name, storeId }: UpdateSizeRepository.Input): Promise<Size> {
    await db.execute<ResultSetHeader>(
      `
        UPDATE TAMANHO 
        SET tam_nome=?, tam_abreviatura=? 
        WHERE tam_cod=? AND cod_loja=?;
      `,
      [name, value, sizeId, storeId],
    );
    return this.findOne({ id: sizeId, storeId }) as Promise<Size>;
  }

  async findOne(input: FindSizeRepository.Input): Promise<Size | null> {
    let query = "SELECT * FROM TAMANHO WHERE ";

    const queryParams: (number | string)[] = [];
    if (input.id) {
      query += " tam_cod=? AND cod_loja=?;";
      queryParams.push(input.id, input.storeId);
    } else if (input.name) {
      query += " tam_nome=? AND cod_loja=?;";
      queryParams.push(input.name, input.storeId);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    if (rows.length <= 0) return null;
    const rawSize = rows[0] as RawSize;
    return this.mapRowToSize(rawSize);
  }

  async findMany({ storeId }: FindSizesRepository.Input): Promise<Size[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT * FROM TAMANHO
        WHERE cod_loja=? 
        ORDER BY data_criacao DESC;
      `,
      [storeId],
    );
    return rows.map(row => this.mapRowToSize(row as RawSize));
  }

  async delete({ id }: DeleteSizeRepository.Input): Promise<void> {
    await db.execute("DELETE FROM TAMANHO WHERE tam_cod=?", [id]);
  }
  private mapRowToSize(row: RawSize): Size {
    return {
      id: row.tam_cod,
      name: row.tam_nome,
      value: row.tam_abreviatura,
      storeId: row.cod_loja,
      createdAt: row.data_criacao,
      updatedAt: row.data_atualizacao,
    };
  }
}

export type RawSize = {
  tam_cod: number;
  tam_nome: string;
  tam_abreviatura: string;
  cod_loja: number;
  data_criacao: Date;
  data_atualizacao: Date;
};
