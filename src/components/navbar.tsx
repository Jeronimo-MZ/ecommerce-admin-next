import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { StoreRepository } from "../../server/repositories/store-repository";
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BaseClientProvider } from "@/providers/base-client-provider";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const storeRepository = new StoreRepository();
  const stores = await storeRepository.findMany({ userId: session.user.id });
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <BaseClientProvider>
          <StoreSwitcher items={stores} />
        </BaseClientProvider>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">{/* <UserButton /> */}</div>
      </div>
    </div>
  );
};
