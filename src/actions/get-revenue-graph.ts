import { prisma } from "@/lib/prisma";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getRevenueGraph(storeId: string) {
  const paidOrders = await prisma.order.findMany({
    where: { storeId, paidAt: { not: null } },
    include: { orderItems: true },
  });
  const monthlyRevenue = paidOrders.reduce(
    (result, order) => {
      const totalForOrder = order.orderItems.reduce(
        (total, currentItem) => total + currentItem.unitPrice.toNumber() * currentItem.quantity,
        0,
      );
      const month = order.createdAt.getMonth();
      result[month] = (result[month] ?? 0) + totalForOrder;
      return result;
    },
    {} as { [key: number]: number },
  );
  const graphData = Array.from(
    {
      length: 12,
    },
    (_, i) => ({ name: `${months[i]}`, total: monthlyRevenue[i] ?? 0 }),
  );

  return graphData;
}
