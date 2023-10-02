import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateProductBodySchema = z.object({
  name: z.string().min(1, "label is required"),
  images: z.object({ url: z.string().url() }).array().min(1, "product must have at least one image"),
  price: z.number().min(0),
  categoryId: z.string().uuid("category is required"),
  colorId: z.string().uuid("color is required"),
  sizeId: z.string().uuid("size is required"),
  isFeatured: z.boolean().optional().default(false),
  isArchived: z.boolean().optional().default(false),
});

type Params = { params: { storeId: string; productId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = updateProductBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { categoryId, colorId, images, name, price, sizeId, isArchived, isFeatured } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const product = await prisma.product.findUnique({ where: { id: params.productId, storeId: store.id } });
    if (!product) return new NextResponse("Forbidden", { status: 403 });

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        categoryId,
        colorId,
        images: {
          deleteMany: {},
          createMany: { data: images.map(image => ({ url: image.url })) },
        },
        name,
        price,
        sizeId,
        isArchived,
        isFeatured,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/products/:productId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const product = await prisma.product.findUnique({ where: { id: params.productId, storeId: store.id } });
    if (!product) return new NextResponse("Product not found", { status: 404 });

    await prisma.product.delete({ where: { id: product.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/products/:productId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: { images: true, category: true, size: true, color: true },
    });
    if (!product) return new NextResponse("Product not found", { status: 404 });

    return NextResponse.json({ ...product, price: product.price.toNumber() });
  } catch (error) {
    console.error(`[GET] /:storeId/products/:productId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
