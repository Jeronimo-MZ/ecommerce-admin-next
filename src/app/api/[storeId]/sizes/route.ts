import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { value, name } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const sizeWithName = await prisma.size.findUnique({ where: { storeId_name: { name, storeId: store.id } } });
    if (sizeWithName) return new NextResponse("You already have a size with this name.", { status: 400 });

    const createdSize = await prisma.size.create({
      data: { name, value, store: { connect: { id: store.id } } },
    });
    return NextResponse.json(createdSize, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/sizes -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const sizes = await prisma.size.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(sizes);
  } catch (error) {
    console.error(`[GET] /:storeId/sizes -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
