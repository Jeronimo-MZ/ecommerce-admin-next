import { RowDataPacket } from "mysql2";

import { db } from "../../server/lib/mysql";

export async function getTotalRevenue(storeId: number): Promise<number> {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT SUM(IP.item_preco_venda * IP.item_quantidade) as revenue
    FROM PEDIDO AS P
    JOIN ITEM_PEDIDO AS IP ON IP.cod_pedido=P.ped_cod
    WHERE cod_loja=? AND ped_data_pagamento IS NOT NULL
    ;
  `,
    [storeId],
  );

  return Number(result[0].revenue ?? 0);
}
