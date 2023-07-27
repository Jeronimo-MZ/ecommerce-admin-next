import { Size } from "@prisma/client";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { SizeForm } from "./components/size-form";

type SizePageProps = {
  params: {
    storeId: string;
    sizeId: string;
  };
};

const SizePage = async ({ params }: SizePageProps) => {
  let sizeData: Size | null = null;
  if (params.sizeId.toLocaleLowerCase() !== "new") {
    const sizeResult = await prisma.size.findUnique({ where: { id: params.sizeId } });
    if (!sizeResult) notFound();
    else {
      sizeData = { ...sizeResult };
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizeData} />
      </div>
    </div>
  );
};

export default SizePage;
