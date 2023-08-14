import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/utils/format-money";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/column";

type ProductsPageProps = {
  params: { storeId: string };
};

const ProductsPage = async ({ params }: ProductsPageProps) => {
  const products = await prisma.product.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
    include: { category: true, size: true, color: true },
  });

  const formattedProducts: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatMoney(product.price.toNumber()),
    color: product.color.value,
    size: product.size.name,
    category: product.category.name,

    createdAt: dayjs(product.createdAt).format("MMMM D, YYYY"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
