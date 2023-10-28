import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { ColorRepository } from "../../../../../server/repositories/color-repository";
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
    const colorRepository = new ColorRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const colorWithName = await colorRepository.findOne({ storeId: store.id, name });
    if (colorWithName) return new NextResponse("Você ja possui uma cor com esse nome.", { status: 400 });

    const createdColor = await colorRepository.create({ name, value, storeId: store.id });
    return NextResponse.json(createdColor, { status: 201 });
  } catch (error) {
    console.error(`[POST] /:storeId/colors -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const colorRepository = new ColorRepository();
    const colors = await colorRepository.findMany({ storeId: Number(params.storeId) });
    return NextResponse.json(colors);
  } catch (error) {
    console.error(`[GET] /:storeId/colors -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
