import { RowDataPacket } from "mysql2";

import { db } from "../../server/lib/mysql";

export async function getStockCount(storeId: number): Promise<number> {
  const [result] = await db.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) as stock
    FROM PRODUTO
    WHERE cod_loja=? AND produto_quantidade_stock > 0
    ;
  `,
    [storeId],
  );
  return Number(result[0].stock);
}
