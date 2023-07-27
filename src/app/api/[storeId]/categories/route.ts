import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().uuid(),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { billboardId, name } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const billboard = await prisma.billboard.findUnique({ where: { id: billboardId, storeId: store.id } });
    if (!billboard) return new NextResponse("Billboard not found", { status: 400 });

    // TODO: change to findUnique (make name unique)
    const categoryWithName = await prisma.category.findFirst({ where: { name, storeId: store.id } });
    if (categoryWithName) return new NextResponse("You already have a category with this name.", { status: 400 });

    const createdCategory = await prisma.category.create({
      data: { name, store: { connect: { id: store.id } }, billboard: { connect: { id: billboard.id } } },
    });
    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/categories -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const categories = await prisma.category.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(categories);
  } catch (error) {
    console.error(`[GET] /:storeId/categories -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
