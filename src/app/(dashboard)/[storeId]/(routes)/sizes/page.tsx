import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";

import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/column";

type SizesPageProps = {
  params: { storeId: string };
};

export const SizesPage = async ({ params }: SizesPageProps) => {
  const sizes = await prisma.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: dayjs(size.createdAt).format("MMMM D, YYYY"),
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
