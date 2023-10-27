import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Navbar } from "@/components/navbar";

import { StoreRepository } from "../../../../server/repositories/store-repository";

type DashboardLayoutProps = {
  children: string;
  params: {
    storeId: string;
  };
};
export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const session = await getServerSession();
  if (!session || !session.user) redirect("/sign-in");

  const storeRepository = new StoreRepository();
  const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });

  if (!store) redirect("/");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
