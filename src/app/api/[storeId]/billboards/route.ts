import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url(),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { imageUrl, label } = validationResult.data;

    const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const createdBillboard = await prisma.billboard.create({
      data: { imageUrl, label, store: { connect: { id: store.id } } },
    });
    return NextResponse.json(createdBillboard, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/billboard -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const billboards = await prisma.billboard.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(billboards);
  } catch (error) {
    console.error(`[GET] /:storeId/billboard -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
