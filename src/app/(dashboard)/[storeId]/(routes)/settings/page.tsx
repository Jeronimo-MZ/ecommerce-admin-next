import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { SettingsForm } from "./components/settings-form";

type SettingsPageProps = {
  params: { storeId: string };
};

export const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const store = await prisma.store.findUnique({ where: { id: params.storeId, userId } });
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
