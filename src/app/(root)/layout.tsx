import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

type RootLayoutProps = {
  children: string;
};
export default async function RootLayout({ children }: RootLayoutProps) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const store = await prisma.store.findFirst({
    where: { userId },
  });

  if (store) redirect(`/${store.id}`);

  return <>{children}</>;
}
