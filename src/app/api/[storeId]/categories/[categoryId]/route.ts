import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { BillboardRepository } from "../../../../../../server/repositories/billboard-repository";
import { CategoryRepository } from "../../../../../../server/repositories/category-repository";
import { ProductRepository } from "../../../../../../server/repositories/product-repository";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
  billboardId: z.number(),
});

type Params = { params: { storeId: string; categoryId: string } };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const validationResult = updateCategoryBodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { billboardId, name } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const categoryRepository = new CategoryRepository();
    const billboardRepository = new BillboardRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const category = await categoryRepository.findOne({ id: Number(params.categoryId), storeId: store.id });
    if (!category) return new NextResponse("Categoria não encontrada", { status: 400 });

    const billboard = await billboardRepository.findOne({
      id: billboardId,
      storeId: Number(params.storeId),
    });
    if (!billboard) return new NextResponse("Capa não encontraada", { status: 404 });

    if (category.name !== name) {
      const categoryWithName = await categoryRepository.findOne({ storeId: store.id, name });
      if (categoryWithName) return new NextResponse("Você já possui uma categoria com esse nome.", { status: 400 });
    }

    const updatedCategory = await categoryRepository.update({
      categoryId: category.id,
      name,
      storeId: store.id,
      billboardId,
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(`[POST] /:storeId/categories/:categoryId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const categoryRepository = new CategoryRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const category = await categoryRepository.findOne({ id: Number(params.categoryId), storeId: store.id });
    if (!category) return new NextResponse("Categoria não encontrada", { status: 400 });

    const productRepository = new ProductRepository();
    if (await productRepository.checkBy({ categoryId: category.id, storeId: store.id })) {
      return new NextResponse("A Categoria não pode ser deletada pois tem produtos associados!", { status: 400 });
    }

    await categoryRepository.delete({ id: category.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /:storeId/categories/:categoryId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const categoryRepository = new CategoryRepository();
    const category = await categoryRepository.findOne({
      id: Number(params.categoryId),
      storeId: Number(params.storeId),
    });
    if (!category) return new NextResponse("Categoria não encontrada", { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    console.error(`[GET] /:storeId/categories/:categoryId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
