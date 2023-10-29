import { notFound } from "next/navigation";

import { Product } from "../../../../../../../server/models/product";
import { CategoryRepository } from "../../../../../../../server/repositories/category-repository";
import { ColorRepository } from "../../../../../../../server/repositories/color-repository";
import { ProductRepository } from "../../../../../../../server/repositories/product-repository";
import { SizeRepository } from "../../../../../../../server/repositories/size-repository";
import { ProductForm } from "./components/product-form";

type ProductPageProps = {
  params: {
    storeId: string;
    productId: string;
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  let productData: Product | null = null;
  if (params.productId.toLocaleLowerCase() !== "new") {
    const productRepository = new ProductRepository();
    const productResult = await productRepository.findOne({
      storeId: Number(params.storeId),
      id: Number(params.productId),
    });
    if (!productResult) {
      notFound();
    } else {
      productData = { ...productResult, price: productResult.price / 100 };
    }
  }

  const categoryRepository = new CategoryRepository();
  const sizeRepository = new SizeRepository();
  const colorRepository = new ColorRepository();

  const [categories, sizes, colors] = await Promise.all([
    categoryRepository.findMany({ storeId: Number(params.storeId) }),
    sizeRepository.findMany({ storeId: Number(params.storeId) }),
    colorRepository.findMany({ storeId: Number(params.storeId) }),
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={productData} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  );
};

export default ProductPage;
