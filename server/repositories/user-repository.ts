import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";

import { CreateUserRepository, FindUserRepository } from "../contracts/repositories/user";
import { db } from "../lib/mysql";
import { User } from "../models/user";

export class UserRepository implements CreateUserRepository, FindUserRepository {
  async create(input: CreateUserRepository.Input): Promise<User> {
    const [insertResult] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO UTILIZADOR(utilizador_nome, utilizador_email,utilizador_senha, utilizador_endereco) 
        VALUES (?,?,?,?)
    `,
      [input.name, input.email, input.password, input.address],
    );
    const userId = insertResult.insertId;
    return this.findOne({ id: userId }) as Promise<User>;
  }

  async findOne({ email, id }: FindUserRepository.Input): Promise<User | null> {
    let query = "SELECT * FROM UTILIZADOR WHERE";
    const queryParams: any[] = [];

    if (email) {
      query += " utilizador_email = ?;";
      queryParams.push(email);
    } else if (id) {
      query += " utilizador_cod = ?;";
      queryParams.push(id);
    }
    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    if (rows.length <= 0) return null;
    const rawUser = rows[0] as RawUser;
    return this.mapRowToUser(rawUser);
  }

  private mapRowToUser(row: RawUser): User {
    return {
      id: row.utilizador_cod,
      name: row.utilizador_nome,
      email: row.utilizador_email,
      password: row.utilizador_senha,
      address: row.utilizador_endereco,
      createdAt: row.data_criacao,
      updatedAt: row.data_atualizacao,
    };
  }
}

export type RawUser = {
  utilizador_cod: number;
  utilizador_nome: string;
  utilizador_email: string;
  utilizador_senha: string;
  utilizador_endereco: string;
  data_criacao: Date;
  data_atualizacao: Date;
};
