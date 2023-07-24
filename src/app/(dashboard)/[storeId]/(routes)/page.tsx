import { NextPage } from "next";

type DashboardPageProps = {
  params: { storeId: string };
};

export const DashboardPage: NextPage<DashboardPageProps> = props => {
  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
