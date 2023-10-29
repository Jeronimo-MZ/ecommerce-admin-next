import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { ProductRepository } from "../../../../../../server/repositories/product-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";

const updateProductBodySchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  images: z.object({ url: z.string().url() }).array().min(1, "Deve ter pelo menos uma imagem"),
  price: z.number({ required_error: "Campo Obrigatório" }).min(0),
  quantityInStock: z.number({ required_error: "Campo Obrigatório" }).min(0),
  categoryId: z.coerce.number({ required_error: "Campo Obrigatório" }),
  colorId: z.coerce.number({ required_error: "Campo Obrigatório" }),
  sizeId: z.coerce.number({ required_error: "Campo Obrigatório" }),
});

type Params = { params: { storeId: string; productId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const validationResult = updateProductBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { categoryId, colorId, images, name, price, quantityInStock, sizeId } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const productRepository = new ProductRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const product = await productRepository.findOne({ id: Number(params.productId), storeId: store.id });
    if (!product) return new NextResponse("Produto não encontrado", { status: 400 });

    if (product.name !== name) {
      const productWithName = await productRepository.findOne({ storeId: store.id, name });
      if (productWithName) return new NextResponse("Você já possui um produto com esse nome.", { status: 400 });
    }

    const updatedProduct = await productRepository.update({
      id: product.id,
      images: images.map(image => image.url),
      categoryId,
      colorId,
      name,
      price,
      quantityInStock,
      sizeId,
      storeId: store.id,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/products/:productId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const productRepository = new ProductRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const product = await productRepository.findOne({ id: Number(params.productId), storeId: store.id });
    if (!product) return new NextResponse("Produto não encontrado", { status: 400 });

    await productRepository.delete({ id: product.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/products/:productId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const productRepository = new ProductRepository();
    const product = await productRepository.findOne({ storeId: Number(params.storeId), id: Number(params.productId) });
    if (!product) return new NextResponse("Product not found", { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(`[GET] /:storeId/products/:productId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
