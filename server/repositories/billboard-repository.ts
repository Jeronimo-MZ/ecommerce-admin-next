import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  CreateBillboardRepository,
  FindBillboardRepository,
  FindBillboardsRepository,
} from "../contracts/repositories/billboard";
import { db } from "../lib/mysql";
import { Billboard } from "../models/billboard";
import { DeleteBillboardRepository } from "../contracts/repositories/billboard/delete-billboard";
import { UpdateBillboardRepository } from "../contracts/repositories/billboard/update-billboard";

export class BillboardRepository
  implements
    CreateBillboardRepository,
    FindBillboardRepository,
    FindBillboardsRepository,
    DeleteBillboardRepository,
    UpdateBillboardRepository
{
  async create({ imageUrl, label, storeId }: CreateBillboardRepository.Input): Promise<Billboard> {
    const [insertResult] = await db.execute<ResultSetHeader>(
      `
              INSERT INTO CAPA(capa_texto, capa_url_imagem, cod_loja) 
              VALUES (?, ?, ?)
            `,
      [label, imageUrl, storeId],
    );
    const billboardId = insertResult.insertId;
    return this.findOne({ id: billboardId }) as Promise<Billboard>;
  }

  async update({ billboardId, imageUrl, label }: UpdateBillboardRepository.Input): Promise<Billboard> {
    await db.execute<ResultSetHeader>(
      `
              UPDATE CAPA SET capa_texto=?, capa_url_imagem=? 
              WHERE capa_cod=?
            `,
      [label, imageUrl, billboardId],
    );
    return this.findOne({ id: billboardId }) as Promise<Billboard>;
  }

  async findOne({ id }: FindBillboardRepository.Input): Promise<Billboard | null> {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM CAPA WHERE capa_cod=?", [id]);
    if (rows.length <= 0) return null;
    const rawBillboard = rows[0] as RawBillboard;
    return this.mapRowToBillboard(rawBillboard);
  }

  async findMany({ storeId }: FindBillboardsRepository.Input): Promise<Billboard[]> {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM CAPA WHERE cod_loja=? ORDER BY data_criacao DESC;", [
      storeId,
    ]);
    return rows.map(row => this.mapRowToBillboard(row as RawBillboard));
  }

  async delete({ id }: DeleteBillboardRepository.Input): Promise<void> {
    await db.execute("DELETE FROM CAPA WHERE capa_cod=?", [id]);
  }
  private mapRowToBillboard(row: RawBillboard): Billboard {
    return {
      id: row.capa_cod,
      label: row.capa_texto,
      imageUrl: row.capa_url_imagem,
      storeId: row.cod_loja,
      createdAt: row.data_criacao,
      updatedAt: row.data_atualizacao,
    };
  }
}

export type RawBillboard = {
  capa_cod: number;
  capa_texto: string;
  capa_url_imagem: string;
  cod_loja: number;
  data_criacao: Date;
  data_atualizacao: Date;
};
