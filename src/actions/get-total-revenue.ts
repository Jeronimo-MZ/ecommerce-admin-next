import { prisma } from "@/lib/prisma";

export async function getTotalRevenue(storeId: string): Promise<number> {
  const paidOrders = await prisma.order.findMany({
    where: { storeId, paidAt: { not: null } },
    include: { orderItems: true },
  });

  return paidOrders
    .flatMap(order => order.orderItems)
    .reduce((total, currentItem) => total + currentItem.unitPrice.toNumber() * currentItem.quantity, 0);
}
