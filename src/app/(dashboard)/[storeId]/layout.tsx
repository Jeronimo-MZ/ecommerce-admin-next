import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

type DashboardLayoutProps = {
  children: string;
  params: {
    storeId: string;
  };
};
export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  if (!store) redirect("/");

  return (
    <>
      <div>this will be a navbar</div>
      {children}
    </>
  );
}
