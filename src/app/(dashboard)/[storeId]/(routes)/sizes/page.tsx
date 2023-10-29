import dayjs from "dayjs";

import { SizeRepository } from "../../../../../../server/repositories/size-repository";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/column";

type SizesPageProps = {
  params: { storeId: string };
};

const SizesPage = async ({ params }: SizesPageProps) => {
  const sizeRepository = new SizeRepository();
  const sizes = await sizeRepository.findMany({ storeId: Number(params.storeId) });

  const formattedSizes: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: dayjs(size.createdAt).format("DD/MM/YYYY"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
