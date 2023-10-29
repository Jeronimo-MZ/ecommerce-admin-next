import dayjs from "dayjs";
import { redirect } from "next/navigation";

import { formatMoney } from "@/utils/format-money";

import { ProductRepository } from "../../../../../../server/repositories/product-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/column";

type ProductsPageProps = {
  params: { storeId: string };
};

const ProductsPage = async ({ params }: ProductsPageProps) => {
  const storeRepository = new StoreRepository();
  const productRepository = new ProductRepository();
  const store = await storeRepository.findOne({ id: Number(params.storeId) });
  if (!store) redirect("/");

  const products = await productRepository.findMany({ storeId: store.id });

  const formattedProducts: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    price: formatMoney(product.price / 100, store.currency),
    color: product.color.value,
    size: product.size.name,
    category: product.category.name,
    createdAt: dayjs(product.createdAt).format("DD/MM/YYYY"),
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
