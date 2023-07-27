import { Product, ProductImage } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { ProductForm } from "./components/product-form";

type ProductPageProps = {
  params: {
    storeId: string;
    productId: string;
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  let productData: (Omit<Product, "price"> & { images: ProductImage[]; price: number }) | null = null;
  if (params.productId.toLocaleLowerCase() !== "new") {
    const productResult = await prisma.product.findUnique({
      where: { id: params.productId, storeId: params.storeId },
      include: { images: true },
    });
    if (!productResult) {
      notFound();
    } else {
      productData = { ...productResult, price: productResult.price.toNumber() };
    }
  }
  const [categories, sizes, colors] = await prisma.$transaction([
    prisma.category.findMany({ where: { storeId: params.storeId } }),
    prisma.size.findMany({ where: { storeId: params.storeId } }),
    prisma.color.findMany({ where: { storeId: params.storeId } }),
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
