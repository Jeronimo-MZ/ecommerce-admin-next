import { auth, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) redirect("/");
  const stores = await prisma.store.findMany({ where: { userId } });
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
};
