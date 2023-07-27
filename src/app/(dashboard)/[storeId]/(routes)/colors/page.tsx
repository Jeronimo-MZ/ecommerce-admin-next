import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";

import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/column";

type ColorsPageProps = {
  params: { storeId: string };
};

export const ColorsPage = async ({ params }: ColorsPageProps) => {
  const colors = await prisma.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
  });

  const formattedColors: ColorColumn[] = colors.map(color => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: dayjs(color.createdAt).format("MMMM D, YYYY"),
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
