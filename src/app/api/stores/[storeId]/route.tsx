import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const name: string | undefined = body.name;
    if (!name || name.length < 1) return new NextResponse("name is required", { status: 400 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("store not found", { status: 404 });

    const storeWithName = await prisma.store.findUnique({ where: { name_userId: { userId, name } } });
    if (storeWithName) return new NextResponse("you already have another store with this name", { status: 400 });

    await prisma.store.update({ where: { id: store.id, userId }, data: { name } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[PATCH] /stores/:storeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("store not found", { status: 404 });
    await prisma.store.delete({ where: { id: store.id, userId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /stores/:storeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
