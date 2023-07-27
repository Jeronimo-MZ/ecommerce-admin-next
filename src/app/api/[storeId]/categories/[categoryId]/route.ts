import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().uuid(),
});

type Params = { params: { storeId: string; categoryId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = updateCategoryBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { billboardId, name } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const billboard = await prisma.billboard.findUnique({ where: { id: billboardId, storeId: store.id } });
    if (!billboard) return new NextResponse("Billboard not found", { status: 400 });

    const category = await prisma.category.findUnique({ where: { id: params.categoryId, storeId: store.id } });
    if (!category) return new NextResponse("Category not found", { status: 400 });

    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: { name, billboard: { connect: billboard } },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/categories/:categoryId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const category = await prisma.category.findUnique({ where: { id: params.categoryId, storeId: store.id } });
    if (!category) return new NextResponse("Category not found", { status: 404 });

    await prisma.category.delete({ where: { id: category.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/categories/:categoryId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.categoryId },
      include: { billboard: true },
    });
    if (!category) return new NextResponse("Category not found", { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    console.error(`[GET] /:storeId/categories/:categoryId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
