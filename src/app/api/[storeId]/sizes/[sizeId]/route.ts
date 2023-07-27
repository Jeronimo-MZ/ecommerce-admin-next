import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type Params = { params: { storeId: string; sizeId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = updateCategoryBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { value, name } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const size = await prisma.size.findUnique({ where: { id: params.sizeId, storeId: store.id } });
    if (!size) return new NextResponse("Size not found", { status: 400 });

    if (size.name !== name) {
      const sizeWithName = await prisma.size.findUnique({ where: { storeId_name: { name, storeId: store.id } } });
      if (sizeWithName) return new NextResponse("You have another size with this name.", { status: 400 });
    }

    const updatedSize = await prisma.size.update({
      where: { id: size.id },
      data: { name, value },
    });

    return NextResponse.json(updatedSize, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/sizes/:sizeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const size = await prisma.size.findUnique({ where: { id: params.sizeId, storeId: store.id } });
    if (!size) return new NextResponse("Size not found", { status: 404 });

    await prisma.size.delete({ where: { id: size.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/sizes/:sizeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const size = await prisma.size.findUnique({
      where: { id: params.sizeId },
    });
    if (!size) return new NextResponse("Size not found", { status: 404 });
    return NextResponse.json(size);
  } catch (error) {
    console.error(`[GET] /:storeId/sizes/:sizeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
