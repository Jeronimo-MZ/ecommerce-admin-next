import { BillboardClient } from "./components/client";

type BillboardsPageProps = {
  params: { storeId: string };
};

export const BillboardsPage = (props: BillboardsPageProps) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
};

export default BillboardsPage;
