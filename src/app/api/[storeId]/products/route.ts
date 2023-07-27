import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(1, "label is required"),
  images: z.object({ url: z.string().url() }).array().min(1, "product must have at least one image"),
  price: z.number().min(0),
  categoryId: z.string().uuid("category is required"),
  colorId: z.string().uuid("color is required"),
  sizeId: z.string().uuid("size is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { categoryId, colorId, images, name, price, sizeId, isArchived, isFeatured } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    // TODO: Validate data, currently relying on database relations validation

    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
        category: { connect: { id: categoryId } },
        color: { connect: { id: colorId } },
        store: { connect: { id: store.id } },
        size: { connect: { id: sizeId } },
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: images.map(item => ({ url: item.url })),
            skipDuplicates: true,
          },
        },
      },
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
    const isFeatured = searchParams.get("isFeatured") || undefined;

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error(`[GET] /:storeId/products -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
