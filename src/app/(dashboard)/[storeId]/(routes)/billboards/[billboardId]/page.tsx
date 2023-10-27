import { notFound } from "next/navigation";

import { Billboard } from "../../../../../../../server/models/billboard";
import { BillboardRepository } from "../../../../../../../server/repositories/billboard-repository";
import { BillboardForm } from "./components/billboard-form";

type BillboardPageProps = {
  params: {
    storeId: string;
    billboardId: string;
  };
};

const BillboardPage = async ({ params }: BillboardPageProps) => {
  let billboardData: Billboard | null = null;
  if (params.billboardId.toLocaleLowerCase() !== "new") {
    const billboardRepository = new BillboardRepository();
    const billboardResult = await billboardRepository.findOne({ id: Number(params.billboardId) });
    if (!billboardResult) {
      notFound();
    } else {
      billboardData = { ...billboardResult };
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboardData} />
      </div>
    </div>
  );
};

export default BillboardPage;
