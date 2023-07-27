import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type Params = { params: { storeId: string; colorId: string } };

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

    const color = await prisma.color.findUnique({ where: { id: params.colorId, storeId: store.id } });
    if (!color) return new NextResponse("Color not found", { status: 400 });

    if (color.name !== name) {
      const colorWithName = await prisma.color.findUnique({ where: { storeId_name: { name, storeId: store.id } } });
      if (colorWithName) return new NextResponse("You have another color with this name.", { status: 400 });
    }

    const updatedColor = await prisma.color.update({
      where: { id: color.id },
      data: { name, value },
    });

    return NextResponse.json(updatedColor, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/colors/:colorId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const color = await prisma.color.findUnique({ where: { id: params.colorId, storeId: store.id } });
    if (!color) return new NextResponse("Color not found", { status: 404 });

    await prisma.color.delete({ where: { id: color.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/colors/:colorId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const color = await prisma.color.findUnique({
      where: { id: params.colorId },
    });
    if (!color) return new NextResponse("Color not found", { status: 404 });
    return NextResponse.json(color);
  } catch (error) {
    console.error(`[GET] /:storeId/colors/:colorId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
