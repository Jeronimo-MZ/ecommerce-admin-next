import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { BillboardRepository } from "../../../../../../server/repositories/billboard-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";

const updateBillboardBodySchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url(),
});

export async function PATCH(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const body = await req.json();
    const validationResult = updateBillboardBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { imageUrl, label } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });
    const billboardRepository = new BillboardRepository();

    const billboard = await billboardRepository.findOne({
      id: Number(params.billboardId),
      storeId: Number(params.storeId),
    });
    if (!billboard || billboard.storeId !== store.id) return new NextResponse("Forbidden", { status: 403 });

    const updatedBillboard = await billboardRepository.update({
      billboardId: billboard.id,
      label,
      imageUrl,
      storeId: Number(params.storeId),
    });

    return NextResponse.json(updatedBillboard, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/billboard/:billboardId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });
    const billboardRepository = new BillboardRepository();

    const billboard = await billboardRepository.findOne({
      id: Number(params.billboardId),
      storeId: Number(params.storeId),
    });
    if (!billboard || billboard.storeId !== store.id) return new NextResponse("Forbidden", { status: 403 });

    await billboardRepository.delete({ id: billboard.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/billboard/:billboardId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { billboardId: string; storeId: string } }) {
  try {
    const billboardRepository = new BillboardRepository();
    const billboard = await billboardRepository.findOne({
      id: Number(params.billboardId),
      storeId: Number(params.storeId),
    });
    if (!billboard) return new NextResponse("Billboard not found", { status: 404 });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error(`[GET] /:storeId/billboard/:billboardId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
