import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const name: string | undefined = body.name;
    if (!name || name.length < 1) return new NextResponse("name is required", { status: 400 });

    const store = await prisma.store.findUnique({ where: { name_userId: { name, userId } } });
    if (store) return new NextResponse("name already used", { status: 400 });

    const createdStore = await prisma.store.create({ data: { name, userId } });
    return NextResponse.json({ storeId: createdStore.id }, { status: 201 });
  } catch (error) {
    console.error(`[POST] /stores: ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
