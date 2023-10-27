import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { SettingsForm } from "./components/settings-form";
import { getServerSession } from "next-auth";
import { StoreRepository } from "../../../../../../server/repositories/store-repository";

type SettingsPageProps = {
  params: { storeId: string };
};

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const session = await getServerSession();
  if (!session || !session.user) redirect("/");

  const storeRepository = new StoreRepository();
  const store = await storeRepository.findOne({ id: Number(params.storeId), userId: session.user.id });
  if (!store) redirect("/");
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
