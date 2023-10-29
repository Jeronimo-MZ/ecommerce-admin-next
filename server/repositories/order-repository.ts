import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import {
  CreateOrderRepository,
  DeleteOrderRepository,
  FindOrderRepository,
  FindOrdersRepository,
  PayOrderRepository,
} from "../contracts/repositories/order";
import { db } from "../lib/mysql";
import { Order, OrderItem, OrderWithItems } from "../models/order";

export class OrderRepository
  implements
    CreateOrderRepository,
    FindOrderRepository,
    FindOrdersRepository,
    PayOrderRepository,
    DeleteOrderRepository
{
  async create({ items, storeId }: CreateOrderRepository.Input): Promise<Order> {
    let connection: PoolConnection | undefined;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();
      const [insertResult] = await connection.execute<ResultSetHeader>(
        `
                  INSERT INTO 
                  PEDIDO(ped_status, cod_loja) 
                  VALUES ('PENDENTE', ?)
                `,
        [storeId],
      );
      const orderId = insertResult.insertId;

      for (const item of items) {
        await connection.execute(
          `
              INSERT INTO ITEM_PEDIDO(cod_pedido, cod_produto, item_preco_venda, item_quantidade) 
              SELECT ?, ?, produto_preco, ?
              FROM PRODUTO 
              WHERE produto_cod = ?;
              `,
          [orderId, item.productId, item.quantity, item.productId],
        );
      }
      await connection.commit();
      return this.findOne({ id: orderId, storeId }) as Promise<Order>;
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async findOne({ id, storeId }: FindOrderRepository.Input): Promise<OrderWithItems | null> {
    const [orderRows] = await db.query<RowDataPacket[]>(
      `
        SELECT
            PED.ped_cod AS id,
            PED.ped_status AS status,
            PED.ped_endereco_entrega AS shippingAddress,
            PED.ped_cod_transac AS paymentId,
            PED.ped_data_pagamento AS paymentDate,
            COALESCE(SUM(IP.item_preco_venda * IP.item_quantidade), 0) AS totalInCents,
            PED.data_criacao AS createdAt,
            PED.data_atualizacao AS updatedAt,
            PED.cod_loja AS storeId,
            CLI.cli_cod AS 'customer.id',
            CLI.cli_nome AS 'customer.name',
            CLI.cli_email AS 'customer.email'
        FROM PEDIDO PED
        LEFT JOIN CLIENTE CLI ON PED.cod_cliente = CLI.cli_cod
        LEFT JOIN ITEM_PEDIDO IP ON PED.ped_cod = IP.cod_pedido
        WHERE PED.ped_cod = ? AND PED.cod_loja = ?
        GROUP BY PED.ped_cod
        `,
      [id, storeId],
    );

    if (orderRows.length === 0) {
      return null;
    }

    const rawOrder = orderRows[0] as Order;
    const [orderItemRows] = await db.query<RowDataPacket[]>(
      `
          SELECT
            IP.cod_pedido AS orderId,
            IP.cod_produto AS productId,
            PRO.produto_nome AS productName,
            IP.item_preco_venda AS price,
            IP.item_quantidade AS quantity
          FROM ITEM_PEDIDO IP
          LEFT JOIN PRODUTO PRO ON IP.cod_produto = PRO.produto_cod
          WHERE IP.cod_pedido = ?
        `,
      [id],
    );

    const orderItems: OrderItem[] = orderItemRows.map((rawOrderItem: any) => ({
      orderId: rawOrderItem.orderId,
      productId: rawOrderItem.productId,
      productName: rawOrderItem.productName,
      price: rawOrderItem.price,
      quantity: rawOrderItem.quantity,
    }));

    return { ...rawOrder, items: orderItems };
  }

  async findMany({ storeId }: FindOrdersRepository.Input): Promise<Order[]> {
    const [orderRows] = await db.query<RowDataPacket[]>(
      `
        SELECT
            PED.ped_cod AS id,
            PED.ped_status AS status,
            PED.ped_endereco_entrega AS shippingAddress,
            PED.ped_cod_transac AS paymentId,
            PED.ped_data_pagamento AS paymentDate,
            COALESCE(SUM(IP.item_preco_venda * IP.item_quantidade), 0) AS totalInCents,
            PED.data_criacao AS createdAt,
            PED.data_atualizacao AS updatedAt,
            PED.cod_loja AS storeId,
            CLI.cli_cod AS 'customer.id',
            CLI.cli_nome AS 'customer.name',
            CLI.cli_email AS 'customer.email'
        FROM PEDIDO PED
        LEFT JOIN CLIENTE CLI ON PED.cod_cliente = CLI.cli_cod
        LEFT JOIN ITEM_PEDIDO IP ON PED.ped_cod = IP.cod_pedido
        WHERE PED.cod_loja = ?
        GROUP BY PED.ped_cod
        ORDER BY PED.data_criacao DESC
    `,
      [storeId],
    );

    // Map the raw order data to the Order model
    const orders: Order[] = orderRows.map((rawOrder: any) => ({
      id: rawOrder.id,
      status: rawOrder.status,
      shippingAddress: rawOrder.shippingAddress,
      paymentId: rawOrder.paymentId,
      paymentDate: rawOrder.paymentDate,
      totalInCents: rawOrder.totalInCents,
      createdAt: rawOrder.createdAt,
      updatedAt: rawOrder.updatedAt,
      storeId: rawOrder.storeId,
      customer: {
        id: rawOrder["customer.id"],
        name: rawOrder["customer.name"],
        email: rawOrder["customer.email"],
      },
    }));

    return orders;
  }

  async pay({
    customerEmail,
    customerName,
    id,
    paymentDate,
    paymentId,
    shippingAddress,
    storeId,
  }: PayOrderRepository.Input): Promise<OrderWithItems> {
    let connection: PoolConnection | undefined;

    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Check if the customer with the given email exists
      const [existingCustomer] = await connection.query<RowDataPacket[]>(
        "SELECT cli_cod FROM CLIENTE WHERE cli_email = ? AND cod_loja = ?;",
        [customerEmail, storeId],
      );
      let customerId;
      if (existingCustomer.length === 0) {
        const [insertedCustomer] = await connection.query<ResultSetHeader>(
          "INSERT INTO CLIENTE (cli_email, cli_nome, cod_loja) VALUES (?, ?, ?)",
          [customerEmail, customerName, storeId],
        );
        customerId = insertedCustomer.insertId;
      } else {
        customerId = existingCustomer[0].cli_cod;
      }

      await connection.query(
        `
        UPDATE PEDIDO
        SET
          ped_status = 'PAID',
          ped_endereco_entrega = ?,
          ped_cod_transac = ?,
          ped_data_pagamento = ?,
          cod_cliente = ?
        WHERE ped_cod = ? AND cod_loja = ?
      `,
        [shippingAddress, paymentId, paymentDate, customerId, id, storeId],
      );

      await connection.commit();
      const updatedOrder = await this.findOne({ id, storeId });
      if (updatedOrder === null) {
        throw new Error("Failed to update the order or order not found.");
      }
      return updatedOrder;
    } catch (error) {
      if (connection) await connection.rollback();

      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async delete({ id, storeId }: DeleteOrderRepository.Input): Promise<void> {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();
      await connection.query(
        `
        DELETE FROM ITEM_PEDIDO WHERE cod_pedido = ?;
        DELETE FROM PEDIDO WHERE ped_cod = ? AND cod_loja = ?;
      `,
        [id, id, storeId],
      );
      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}
