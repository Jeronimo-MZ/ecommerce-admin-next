import { Color } from "@prisma/client";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { ColorForm } from "./components/color-form";

type ColorPageProps = {
  params: {
    storeId: string;
    colorId: string;
  };
};

const ColorPage = async ({ params }: ColorPageProps) => {
  let colorData: Color | null = null;
  if (params.colorId.toLocaleLowerCase() !== "new") {
    const colorResult = await prisma.color.findUnique({ where: { id: params.colorId } });
    if (!colorResult) notFound();
    else {
      colorData = { ...colorResult };
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={colorData} />
      </div>
    </div>
  );
};

export default ColorPage;
