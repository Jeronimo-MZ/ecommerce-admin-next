import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { BillboardRepository } from "../../../../../server/repositories/billboard-repository";
import { StoreRepository } from "../../../../../server/repositories/store-repository";
import { authOptions } from "../../auth/[...nextauth]/route";

const bodySchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url(),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { imageUrl, label } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const billboardRepository = new BillboardRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const createdBillboard = await billboardRepository.create({
      imageUrl,
      label,
      storeId: store.id,
    });
    return NextResponse.json(createdBillboard, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/billboard -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const billboardRepository = new BillboardRepository();
    const billboards = await billboardRepository.findMany({ storeId: Number(params.storeId) });
    return NextResponse.json(billboards);
  } catch (error) {
    console.error(`[GET] /:storeId/billboard -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
