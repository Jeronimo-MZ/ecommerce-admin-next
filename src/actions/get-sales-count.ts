import { prisma } from "@/lib/prisma";

export async function getSalesCount(storeId: string): Promise<number> {
  return await prisma.order.count({
    where: { storeId, paidAt: { not: null } },
  });
}
