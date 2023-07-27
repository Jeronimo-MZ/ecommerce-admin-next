import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/column";

type CategoriesPageProps = {
  params: { storeId: string };
};

export const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const categories = await prisma.category.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
    include: { billboard: true },
  });

  const formattedCategories: CategoryColumn[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: dayjs(category.createdAt).format("MMMM D, YYYY"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
