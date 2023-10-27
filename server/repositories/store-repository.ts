import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CreateStoreRepository, FindStoreRepository, FindStoresRepository } from "../contracts/repositories/store";
import { db } from "../lib/mysql";
import { Store } from "../models/store";
import { DeleteStoreRepository } from "../contracts/repositories/store/delete-store";
import { UpdateStoreRepository } from "../contracts/repositories/store/update-store";

export class StoreRepository
  implements
    CreateStoreRepository,
    FindStoreRepository,
    FindStoresRepository,
    DeleteStoreRepository,
    UpdateStoreRepository
{
  async create({ currency, name, url, userId }: CreateStoreRepository.Input): Promise<Store> {
    const [insertResult] = await db.execute<ResultSetHeader>(
      `
              INSERT INTO LOJA(loja_nome, loja_url, loja_moeda_usada, cod_utilizador) 
              VALUES (?, ?, ?, ?)
            `,
      [name, url, currency, userId],
    );
    const storeId = insertResult.insertId;
    return this.findOne({ id: storeId }) as Promise<Store>;
  }

  async update({ currency, name, storeId, url, userId }: UpdateStoreRepository.Input): Promise<Store> {
    await db.execute<ResultSetHeader>(
      `
              UPDATE LOJA SET loja_nome=?, loja_url=?, loja_moeda_usada=? 
              WHERE loja_cod=? AND cod_utilizador=?;
            `,
      [name, url, currency, storeId, userId],
    );
    return this.findOne({ id: storeId }) as Promise<Store>;
  }

  async findOne(input: FindStoreRepository.Input): Promise<Store | null> {
    let query = "SELECT * FROM LOJA WHERE ";
    const queryParams: any[] = [];
    if (input.id && input.userId) {
      query += " loja_cod = ?  AND cod_utilizador=?;";
      queryParams.push(input.id, input.userId);
    } else if (input.id) {
      query += " loja_cod = ?;";
      queryParams.push(input.id);
    } else if (input.name) {
      query += " loja_nome LIKE ? AND cod_utilizador=?;";
      queryParams.push(input.name, input.userId);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    if (rows.length <= 0) return null;
    const rawStore = rows[0] as RawStore;
    return this.mapRowToStore(rawStore);
  }

  async findMany({ userId }: FindStoresRepository.Input): Promise<Store[]> {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM LOJA WHERE cod_utilizador=?", [userId]);
    return rows.map(row => this.mapRowToStore(row as RawStore));
  }

  async delete({ id, userId }: DeleteStoreRepository.Input): Promise<void> {
    await db.execute("DELETE FROM LOJA WHERE loja_cod=? AND cod_utilizador=?", [id, userId]);
  }
  private mapRowToStore(row: RawStore): Store {
    return {
      id: row.loja_cod,
      name: row.loja_nome,
      url: row.loja_url,
      currency: row.loja_moeda_usada,
      userId: row.cod_utilizador,
      createdAt: row.data_criacao,
      updatedAt: row.data_atualizacao,
    };
  }
}

export type RawStore = {
  loja_cod: number;
  loja_nome: string;
  loja_url: string;
  loja_moeda_usada: string;
  cod_utilizador: number;
  data_criacao: Date;
  data_atualizacao: Date;
};
