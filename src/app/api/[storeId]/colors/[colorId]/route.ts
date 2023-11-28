import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { ColorRepository } from "../../../../../../server/repositories/color-repository";
import { ProductRepository } from "../../../../../../server/repositories/product-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type Params = { params: { storeId: string; colorId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const validationResult = updateCategoryBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { value, name } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const colorRepository = new ColorRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const color = await colorRepository.findOne({ id: Number(params.colorId), storeId: store.id });
    if (!color) return new NextResponse("Cor não encontrada", { status: 400 });

    if (color.name !== name) {
      const colorWithName = await colorRepository.findOne({ storeId: store.id, name });
      if (colorWithName) return new NextResponse("Você já possui uma cor com esse nome.", { status: 400 });
    }

    const updatedColor = await colorRepository.update({ colorId: color.id, name, storeId: store.id, value });
    return NextResponse.json(updatedColor, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/colors/:colorId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const colorRepository = new ColorRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const color = await colorRepository.findOne({ id: Number(params.colorId), storeId: store.id });
    if (!color) return new NextResponse("Cor não encontrada", { status: 400 });

    const productRepository = new ProductRepository();
    if (await productRepository.checkBy({ colorId: color.id, storeId: store.id })) {
      return new NextResponse("A Cor não pode ser deletada pois tem produtos associados!", { status: 400 });
    }

    await colorRepository.delete({ id: color.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/colors/:colorId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const colorRepository = new ColorRepository();
    const color = await colorRepository.findOne({ id: Number(params.colorId), storeId: Number(params.storeId) });
    if (!color) return new NextResponse("tamanho não encontrado", { status: 400 });
    return NextResponse.json(color);
  } catch (error) {
    console.error(`[GET] /:storeId/colors/:colorId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
