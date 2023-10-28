import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { BillboardRepository } from "../../../../../server/repositories/billboard-repository";
import { CategoryRepository } from "../../../../../server/repositories/category-repository";
import { StoreRepository } from "../../../../../server/repositories/store-repository";
import { authOptions } from "../../auth/[...nextauth]/route";

const bodySchema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  billboardId: z.coerce.number(),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { billboardId, name } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const billboardRepository = new BillboardRepository();
    const categoryRepository = new CategoryRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });
    const billboard = await billboardRepository.findOne({ id: Number(billboardId), storeId: store.id });
    if (!billboard) return new NextResponse("Capa não encontrada", { status: 400 });

    const categoryWithName = await categoryRepository.findOne({ name, storeId: store.id });
    if (categoryWithName) return new NextResponse("Você já possui uma categoria com esse nome.", { status: 400 });

    const createdCategory = await categoryRepository.create({ billboardId: billboard.id, name, storeId: store.id });
    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/categories -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const categoryRepository = new CategoryRepository();
    const categories = await categoryRepository.findMany({ storeId: Number(params.storeId) });
    return NextResponse.json(categories);
  } catch (error) {
    console.error(`[GET] /:storeId/categories -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
