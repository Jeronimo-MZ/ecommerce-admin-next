import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { UserRepository } from "../../../../../server/repositories/user-repository";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6, "a senha deve ter no mínimo 6 caracteres"),
  address: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = bodySchema.safeParse(body);
    if (!validationResult.success) return new NextResponse(validationResult.error.message, { status: 400 });
    const { address, email, name, password } = validationResult.data;

    const userRepository = new UserRepository();
    const userWithEmail = await userRepository.findOne({ email });
    if (userWithEmail) {
      return new NextResponse("Email já usado!", { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const user = await userRepository.create({ address, email, name, password: hashedPassword });
    return NextResponse.json({ user: { ...user, password: undefined } }, { status: 201 });
  } catch (error) {
    console.error(`[POST] /auth/sign-up: ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
