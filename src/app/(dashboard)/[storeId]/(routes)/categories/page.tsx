import dayjs from "dayjs";

import { CategoryRepository } from "../../../../../../server/repositories/category-repository";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/column";

type CategoriesPageProps = {
  params: { storeId: string };
};

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const categoryRepository = new CategoryRepository();
  const categories = await categoryRepository.findMany({
    storeId: Number(params.storeId),
  });

  const formattedCategories: CategoryColumn[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: dayjs(category.createdAt).format("DD/MM/YYYY"),
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
