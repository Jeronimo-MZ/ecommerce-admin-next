import { ResultSetHeader, RowDataPacket } from "mysql2";

import {
  CreateColorRepository,
  DeleteColorRepository,
  FindColorRepository,
  FindColorsRepository,
  UpdateColorRepository,
} from "../contracts/repositories/color";
import { db } from "../lib/mysql";
import { Color } from "../models/color";

export class ColorRepository
  implements
    CreateColorRepository,
    FindColorRepository,
    FindColorsRepository,
    DeleteColorRepository,
    UpdateColorRepository
{
  async create({ name, storeId, value }: CreateColorRepository.Input): Promise<Color> {
    const [insertResult] = await db.execute<ResultSetHeader>(
      `
              INSERT INTO COR(cor_nome, cor_codigo_hexadecimal, cod_loja) 
              VALUES (?, ?, ?)
            `,
      [name, value, storeId],
    );
    const colorId = insertResult.insertId;
    return this.findOne({ id: colorId, storeId }) as Promise<Color>;
  }

  async update({ colorId, value, name, storeId }: UpdateColorRepository.Input): Promise<Color> {
    await db.execute<ResultSetHeader>(
      `
        UPDATE COR 
        SET cor_nome=?, cor_codigo_hexadecimal=? 
        WHERE cor_cod=? AND cod_loja=?;
      `,
      [name, value, colorId, storeId],
    );
    return this.findOne({ id: colorId, storeId }) as Promise<Color>;
  }

  async findOne(input: FindColorRepository.Input): Promise<Color | null> {
    let query = "SELECT * FROM COR WHERE ";

    const queryParams: (number | string)[] = [];
    if (input.id) {
      query += " cor_cod=? AND cod_loja=?;";
      queryParams.push(input.id, input.storeId);
    } else if (input.name) {
      query += " cor_nome=? AND cod_loja=?;";
      queryParams.push(input.name, input.storeId);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    if (rows.length <= 0) return null;
    const rawColor = rows[0] as RawColor;
    return this.mapRowToColor(rawColor);
  }

  async findMany({ storeId }: FindColorsRepository.Input): Promise<Color[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT * FROM COR
        WHERE cod_loja=? 
        ORDER BY data_criacao DESC;
      `,
      [storeId],
    );
    return rows.map(row => this.mapRowToColor(row as RawColor));
  }

  async delete({ id }: DeleteColorRepository.Input): Promise<void> {
    await db.execute("DELETE FROM COR WHERE cor_cod=?", [id]);
  }
  private mapRowToColor(row: RawColor): Color {
    return {
      id: row.cor_cod,
      name: row.cor_nome,
      value: row.cor_codigo_hexadecimal,
      storeId: row.cod_loja,
      createdAt: row.data_criacao,
      updatedAt: row.data_atualizacao,
    };
  }
}

export type RawColor = {
  cor_cod: number;
  cor_nome: string;
  cor_codigo_hexadecimal: string;
  cod_loja: number;
  data_criacao: Date;
  data_atualizacao: Date;
};
