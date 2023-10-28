import { notFound } from "next/navigation";

import { Color } from "../../../../../../../server/models/color";
import { ColorRepository } from "../../../../../../../server/repositories/color-repository";
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
    const colorRepository = new ColorRepository();
    const colorResult = await colorRepository.findOne({ id: Number(params.colorId), storeId: Number(params.storeId) });
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
