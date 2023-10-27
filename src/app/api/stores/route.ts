import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { StoreRepository } from "../../../../server/repositories/store-repository";
import { authOptions } from "../auth/[...nextauth]/route";

const bodySchema = z.object({
  name: z.string().nonempty("Campo Obrigatório"),
  url: z.string().nonempty("Campo Obrigatório").url("Deve ser uma URL válida"),
  currency: z.string().nonempty("Campo Obrigatório"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { currency, name, url } = validationResult.data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();
    const store = await storeRepository.findOne({ name, userId: session.user.id });
    if (store) return new NextResponse("Você já possui uma loja com esse nome", { status: 400 });

    const createdStore = await storeRepository.create({ currency, name, url, userId: session.user.id });
    return NextResponse.json({ storeId: createdStore.id }, { status: 201 });
  } catch (error) {
    console.error(`[POST] /stores: ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
