import { RowDataPacket } from "mysql2";

import { db } from "../../server/lib/mysql";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getRevenueGraph(storeId: number, year: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `
      WITH CTE AS (
        SELECT P.*, SUM(IP.item_preco_venda * IP.item_quantidade) as total
        FROM PEDIDO P
        JOIN ITEM_PEDIDO IP ON IP.cod_pedido=P.ped_cod
        WHERE cod_loja=? AND YEAR(P.data_criacao) = ?
        GROUP BY P.ped_cod
    )

    SELECT MONTH(ped_data_pagamento) payment_month, SUM(total) total_paid
    FROM CTE
    WHERE ped_data_pagamento IS NOT NULL
    GROUP BY payment_month;
`,
    [storeId, year],
  );
  const data: Record<number, number> = {};
  for (const row of rows) {
    data[row.payment_month - 1] = row.total_paid;
  }

  const graphData = Array.from(
    {
      length: 12,
    },
    (_, i) => ({ name: `${months[i]}`, total: Number(data[i] ?? 0) / 100 }),
  );
  return graphData;
}
