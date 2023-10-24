import { prisma } from "@/lib/prisma";

export async function getStockCount(storeId: string): Promise<number> {
  return await prisma.product.count({
    where: { storeId, isArchived: false },
  });
}
