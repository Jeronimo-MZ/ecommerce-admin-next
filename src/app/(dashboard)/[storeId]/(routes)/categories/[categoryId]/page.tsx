import { notFound } from "next/navigation";

import { Category } from "../../../../../../../server/models/category";
import { BillboardRepository } from "../../../../../../../server/repositories/billboard-repository";
import { CategoryRepository } from "../../../../../../../server/repositories/category-repository";
import { CategoryForm } from "./components/category-form";

type CategoryPageProps = {
  params: {
    storeId: string;
    categoryId: string;
  };
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const categoryRepository = new CategoryRepository();
  const billboardRepository = new BillboardRepository();
  let categoryData: Category | null = null;
  if (params.categoryId.toLocaleLowerCase() !== "new") {
    const categoryResult = await categoryRepository.findOne({
      id: Number(params.categoryId),
      storeId: Number(params.storeId),
    });
    if (!categoryResult) notFound();
    else {
      categoryData = { ...categoryResult };
    }
  }

  const billboards = await billboardRepository.findMany({ storeId: Number(params.storeId) });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={categoryData} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
