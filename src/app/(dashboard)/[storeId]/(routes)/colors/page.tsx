import dayjs from "dayjs";

import { ColorRepository } from "../../../../../../server/repositories/color-repository";
import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/column";

type ColorsPageProps = {
  params: { storeId: string };
};

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const colorRepository = new ColorRepository();
  const colors = await colorRepository.findMany({ storeId: Number(params.storeId) });

  const formattedColors: ColorColumn[] = colors.map(color => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: dayjs(color.createdAt).format("DD/MM/YYYY"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
