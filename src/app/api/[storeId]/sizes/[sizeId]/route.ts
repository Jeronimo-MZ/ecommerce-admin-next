import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { ProductRepository } from "../../../../../../server/repositories/product-repository";
import { SizeRepository } from "../../../../../../server/repositories/size-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type Params = { params: { storeId: string; sizeId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const validationResult = updateCategoryBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { value, name } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const sizeRepository = new SizeRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const size = await sizeRepository.findOne({ id: Number(params.sizeId), storeId: store.id });
    if (!size) return new NextResponse("Tamanho não encontrado", { status: 400 });

    if (size.name !== name) {
      const sizeWithName = await sizeRepository.findOne({ storeId: store.id, name });
      if (sizeWithName) return new NextResponse("Você já possui um tamanho com esse nome.", { status: 400 });
    }

    const updatedSize = await sizeRepository.update({ sizeId: size.id, name, storeId: store.id, value });
    return NextResponse.json(updatedSize, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/sizes/:sizeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const sizeRepository = new SizeRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const size = await sizeRepository.findOne({ id: Number(params.sizeId), storeId: store.id });
    if (!size) return new NextResponse("tamanho não encontrado", { status: 400 });

    const productRepository = new ProductRepository();
    if (await productRepository.checkBy({ sizeId: size.id, storeId: store.id })) {
      return new NextResponse("O Tamanho não pode ser deletado pois tem produtos associados!", { status: 400 });
    }

    await sizeRepository.delete({ id: size.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/sizes/:sizeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const sizeRepository = new SizeRepository();
    const size = await sizeRepository.findOne({ id: Number(params.sizeId), storeId: Number(params.storeId) });
    if (!size) return new NextResponse("tamanho não encontrado", { status: 400 });
    return NextResponse.json(size);
  } catch (error) {
    console.error(`[GET] /:storeId/sizes/:sizeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
