import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { SizeRepository } from "../../../../../server/repositories/size-repository";
import { StoreRepository } from "../../../../../server/repositories/store-repository";
import { authOptions } from "../../auth/[...nextauth]/route";

const bodySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { value, name } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const sizeRepository = new SizeRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const sizeWithName = await sizeRepository.findOne({ storeId: store.id, name });
    if (sizeWithName) return new NextResponse("Você ja possui um tamanho com esse nome.", { status: 400 });

    const createdSize = await sizeRepository.create({ name, value, storeId: store.id });
    return NextResponse.json(createdSize, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/sizes -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const sizeRepository = new SizeRepository();
    const sizes = await sizeRepository.findMany({ storeId: Number(params.storeId) });
    return NextResponse.json(sizes);
  } catch (error) {
    console.error(`[GET] /:storeId/sizes -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
