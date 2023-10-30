"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { InputGroup } from "../../../../components/ui/input-group";

const SignInSchema = z.object({
  email: z.string().nonempty("Campo Obrigatório").email("Email inválido"),
  password: z.string().nonempty("Campo Obrigatório"),
});

type SignInData = z.infer<typeof SignInSchema>;

export default function SignInPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { register, handleSubmit, formState } = useForm<SignInData>({ resolver: zodResolver(SignInSchema) });

  async function handleSignIn(data: SignInData) {
    const result = await signIn("credentials", { ...data, callbackUrl: "/" });
    if (result?.ok === false) {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Entre na sua conta</h1>
        <p className="text-sm text-muted-foreground">Preencha com suas credenciais para entrar na plataforma</p>
      </div>
      {searchParams.error === "CredentialsSignin" && (
        <div className="p-2 bg-red-400 border-1 border-red-800 rounded-lg">
          <p className="flex items-center gap-1">
            <AlertCircleIcon />
            Verifique suas credenciais!
          </p>
        </div>
      )}
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div className="grid gap-4">
            <InputGroup
              {...register("email")}
              label="Email"
              id="email"
              placeholder="mail@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={formState.isSubmitting}
              error={formState.errors.email?.message}
            />
            <InputGroup
              {...register("password")}
              label="Senha"
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              disabled={formState.isSubmitting}
              error={formState.errors.password?.message}
            />

            <Button loading={formState.isSubmitting}>Entrar</Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <Link href="/sign-up" className="bg-background px-2">
              <span className="text-muted-foreground">Ainda não possui uma conta?</span> <span>crie uma agora</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
