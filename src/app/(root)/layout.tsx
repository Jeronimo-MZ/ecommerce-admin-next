import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { StoreRepository } from "../../../server/repositories/store-repository";
import { authOptions } from "../api/auth/[...nextauth]/route";

type RootLayoutProps = {
  children: string;
};
export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/sign-in");
  const storeRepository = new StoreRepository();
  const stores = await storeRepository.findMany({
    userId: session.user.id,
  });
  const store = stores[0];
  if (store) redirect(`/${store.id}`);

  return <>{children}</>;
}
