import { notFound } from "next/navigation";

import { Size } from "../../../../../../../server/models/size";
import { SizeRepository } from "../../../../../../../server/repositories/size-repository";
import { SizeForm } from "./components/size-form";

type SizePageProps = {
  params: {
    storeId: string;
    sizeId: string;
  };
};

const SizePage = async ({ params }: SizePageProps) => {
  let sizeData: Size | null = null;
  if (params.sizeId.toLocaleLowerCase() !== "new") {
    const sizeRepository = new SizeRepository();
    const sizeResult = await sizeRepository.findOne({ id: Number(params.sizeId), storeId: Number(params.storeId) });
    if (!sizeResult) notFound();
    else {
      sizeData = { ...sizeResult };
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizeData} />
      </div>
    </div>
  );
};

export default SizePage;
