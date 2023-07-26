import { Billboard } from "@prisma/client";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { BillboardForm } from "./components/billboard-form";

type BillboardPageProps = {
  params: {
    storeId: string;
    billboardId: string;
  };
};

const BillboardPage = async ({ params }: BillboardPageProps) => {
  let billboardData: Billboard | null = null;
  if (params.billboardId.toLocaleLowerCase() !== "new") {
    const billboardResult = await prisma.billboard.findUnique({ where: { id: params.billboardId } });
    if (!billboardResult) notFound();
    else {
      billboardData = { ...billboardResult };
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboardData} />
      </div>
    </div>
  );
};

export default BillboardPage;
