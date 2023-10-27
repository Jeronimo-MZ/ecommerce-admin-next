import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { StoreRepository } from "../../../../../server/repositories/store-repository";
import { authOptions } from "../../auth/[...nextauth]/route";

const bodySchema = z.object({
  name: z.string().nonempty("Campo Obrigatório"),
  url: z.string().nonempty("Campo Obrigatório").url("Deve ser uma URL válida"),
  currency: z.string().nonempty("Campo Obrigatório"),
});

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { currency, name, url } = validationResult.data;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const storeRepository = new StoreRepository();

    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Loja não encontrada", { status: 404 });

    const storeWithName = await storeRepository.findOne({ userId: session.user.id, name });
    if (storeWithName && storeWithName.id !== store.id)
      return new NextResponse("Você já possui outra loja com esse nome!", { status: 400 });

    const updatedStore = await storeRepository.update({
      storeId: store.id,
      userId: session.user.id,
      name,
      currency,
      url,
    });

    return NextResponse.json({ store: updatedStore }, { status: 200 });
  } catch (error) {
    console.error(`[PATCH] /stores/:storeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    const storeRepository = new StoreRepository();
    const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
    if (!store) return new NextResponse("Loja não encontrada", { status: 404 });
    await storeRepository.delete({ id: store.id, userId: session.user.id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE] /stores/:storeId -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
