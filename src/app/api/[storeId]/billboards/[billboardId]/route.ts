import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateBillboardBodySchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url(),
});

export async function PATCH(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = updateBillboardBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { imageUrl, label } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId, storeId: store.id } });
    if (!billboard) return new NextResponse("Forbidden", { status: 403 });

    const updatedBillboard = await prisma.billboard.update({ where: { id: billboard.id }, data: { label, imageUrl } });

    return NextResponse.json(updatedBillboard, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/billboard/:billboardId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId, storeId: store.id } });
    if (!billboard) return new NextResponse("Billboard not found", { status: 404 });

    await prisma.billboard.delete({ where: { id: billboard.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/billboard/:billboardId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
  try {
    const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId } });
    if (!billboard) return new NextResponse("Billboard not found", { status: 404 });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error(`[GET] /:storeId/billboard/:billboardId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
