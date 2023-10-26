import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

type RootLayoutProps = {
  children: string;
};
export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession();
  if (!session || !session.user) redirect("/sign-in");

  // const store = await prisma.store.findFirst({
  //   where: { userId },
  // });

  // if (store) redirect(`/${store.id}`);

  return <>{children}</>;
}
