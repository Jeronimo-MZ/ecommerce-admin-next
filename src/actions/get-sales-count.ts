import { RowDataPacket } from "mysql2";
import { db } from "../../server/lib/mysql";

export async function getSalesCount(storeId: string): Promise<number> {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) as stock
    FROM PEDIDO
    WHERE cod_loja=? AND ped_data_pagamento IS NOT NULL 
    ;
  `,
    [storeId],
  );
  return Number(result[0].stock);
}
