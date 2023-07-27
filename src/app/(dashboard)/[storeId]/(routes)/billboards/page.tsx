import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/column";

type BillboardsPageProps = {
  params: { storeId: string };
};

export const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const billboards = await prisma.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(billboard => ({
    id: billboard.id,
    label: billboard.label,

    createdAt: dayjs(billboard.createdAt).format("MMMM D, YYYY"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
