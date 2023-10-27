import dayjs from "dayjs";

import { BillboardRepository } from "../../../../../../server/repositories/billboard-repository";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/column";

type BillboardsPageProps = {
  params: { storeId: string };
};

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const billboardRepository = new BillboardRepository();
  const billboards = await billboardRepository.findMany({ storeId: Number(params.storeId) });

  const formattedBillboards: BillboardColumn[] = billboards.map(billboard => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: dayjs(billboard.createdAt).format("DD/MM/YYYY"),
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
