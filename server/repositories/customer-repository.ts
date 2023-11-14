import { RowDataPacket } from "mysql2";

import { db } from "../lib/mysql";

export class CustomerRepository {
  async findMany({ storeId }: FindCustomersRepository.Input): Promise<FindCustomersRepository.Output> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT C.*, COUNT(*) AS total_pedidos 
        FROM CLIENTE C
        JOIN PEDIDO ON cod_cliente=cli_cod
        WHERE C.cod_loja=?
        GROUP BY cli_cod
        ORDER BY data_criacao DESC;
    `,
      [storeId],
    );
    return rows.map(this.map);
  }

  async findOne({ customerId, storeId }: FindCustomerRepository.Input): Promise<FindCustomerRepository.Output> {
    const [rows] = await db.query<RowDataPacket[]>(
      `
          SELECT C.*
          FROM CLIENTE C
          WHERE C.cod_loja=? AND C.cli_cod=?
          GROUP BY cli_cod
          ORDER BY data_criacao DESC;
      `,
      [storeId, customerId],
    );
    if (rows.length === 0) {
      return null;
    }
    return this.map(rows[0]);
  }

  private map(rawCustomer: any) {
    return {
      email: rawCustomer.cli_email,
      name: rawCustomer.cli_nome,
      id: rawCustomer.cli_cod,
      totalOrders: rawCustomer.total_pedidos,
      updatedAt: rawCustomer.data_atualizacao,
      createdAt: rawCustomer.data_criacao,
    };
  }
}

export namespace FindCustomersRepository {
  export type Input = { storeId: number };
  export type Output = Array<{
    id: number;
    name: string;
    email: string;
    totalOrders: number;
    createdAt: number;
    updatedAt: number;
  }>;
}

export namespace FindCustomerRepository {
  export type Input = { storeId: number; customerId: number };
  export type Output = null | {
    id: number;
    name: string;
    email: string;
    totalOrders: number;
    createdAt: number;
    updatedAt: number;
  };
}
