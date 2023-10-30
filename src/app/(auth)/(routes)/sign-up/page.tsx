"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";
import { api } from "@/lib/axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

const SignUpSchema = z.object({
  name: z.string().nonempty("Campo Obrigatório"),
  email: z.string().nonempty("Campo Obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  address: z.string().nonempty("Campo Obrigatório"),
});

type SignUpData = z.infer<typeof SignUpSchema>;

export default function SignInPage() {
  const { register, handleSubmit, formState } = useForm<SignUpData>({ resolver: zodResolver(SignUpSchema) });
  const router = useRouter();
  async function handleSignUp(data: SignUpData) {
    try {
      await api.post("/api/auth/sign-up", data);
      toast.success("Conta criada!");
      router.push("/");
    } catch (error) {
      toast.error(handleAxiosError(error));
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crie uma Conta</h1>
        <p className="text-sm text-muted-foreground">Preencha seus dados para criar uma nova conta!</p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(handleSignUp)}>
          <div className="grid gap-2">
            <div className="grid gap-4">
              <InputGroup
                {...register("name")}
                label="Nome"
                error={formState.errors.name?.message}
                disabled={formState.isSubmitting}
                placeholder="John Doe"
                autoCapitalize="none"
              />
              <InputGroup
                {...register("address")}
                label="Endereço"
                placeholder="Maputo, Moçambique"
                autoCapitalize="none"
                error={formState.errors.address?.message}
                disabled={formState.isSubmitting}
              />
              <InputGroup
                {...register("email")}
                label="Email"
                error={formState.errors.email?.message}
                disabled={formState.isSubmitting}
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
              <InputGroup
                {...register("password")}
                label="Senha"
                error={formState.errors.password?.message}
                disabled={formState.isSubmitting}
                id="password"
                placeholder="********"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
              />
            </div>
            <Button className="mt-4" disabled={formState.isSubmitting} loading={formState.isSubmitting}>
              Criar Conta
            </Button>
          </div>
        </form>
        <div className="relative">
          <p className="mb-4 px-2 text-center text-sm text-muted-foreground">
            Ao clicar em &apos;Criar Conta&apos;, você concorda com os nossos{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Termos de serviço
            </Link>{" "}
            e{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Políticas de privacidade
            </Link>
            .
          </p>
          <div className="relative flex justify-center text-xs uppercase">
            <Link href="/login" className="bg-background px-2">
              <span className="text-muted-foreground">Já possui uma conta?</span> <span>Entre agora</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
