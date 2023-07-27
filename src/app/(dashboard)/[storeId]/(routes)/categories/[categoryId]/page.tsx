import { Category } from "@prisma/client";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { CategoryForm } from "./components/category-form";

type CategoryPageProps = {
  params: {
    storeId: string;
    categoryId: string;
  };
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  let categoryData: Category | null = null;
  if (params.categoryId.toLocaleLowerCase() !== "new") {
    const categoryResult = await prisma.category.findUnique({ where: { id: params.categoryId } });
    if (!categoryResult) notFound();
    else {
      categoryData = { ...categoryResult };
    }
  }
  const billboards = await prisma.billboard.findMany({ where: { storeId: params.storeId } });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={categoryData} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
