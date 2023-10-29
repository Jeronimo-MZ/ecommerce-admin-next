import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { ProductRepository } from "../../../../../server/repositories/product-repository";
import { StoreRepository } from "../../../../../server/repositories/store-repository";
import { authOptions } from "../../auth/[...nextauth]/route";

const bodySchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  images: z.object({ url: z.string().url() }).array().min(1, "Deve ter pelo menos uma imagem"),
  price: z.number({ required_error: "Campo Obrigatório" }).min(0),
  categoryId: z.number({ required_error: "Campo Obrigatório" }),
  colorId: z.number({ required_error: "Campo Obrigatório" }),
  sizeId: z.number({ required_error: "Campo Obrigatório" }),
  quantityInStock: z.number({ required_error: "Campo Obrigatório" }).min(0),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { categoryId, colorId, images, name, price, sizeId, quantityInStock } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const productRepository = new ProductRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const productWithName = await productRepository.findOne({ storeId: store.id, name });
    if (productWithName) return new NextResponse("Você ja possui um produto com esse nome.", { status: 400 });

    // TODO: Validate data, currently relying on database relations validation
    const createdProduct = await productRepository.create({
      name,
      price,
      categoryId,
      colorId,
      quantityInStock,
      sizeId,
      storeId: store.id,
      images: images.map(item => item.url),
    });
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/products -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const inStockOnly = searchParams.get("inStockOnly") || undefined;

    const productRepository = new ProductRepository();

    const products = await productRepository.findMany({
      storeId: Number(params.storeId),
      categoryId: categoryId ? Number(categoryId) : undefined,
      colorId: colorId ? Number(colorId) : undefined,
      sizeId: sizeId ? Number(sizeId) : undefined,
      inStockOnly: inStockOnly === "true",
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error(`[GET] /:storeId/products -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
