import { CreditCardIcon, DollarSign, PackageIcon } from "lucide-react";
import { NextPage } from "next";

import { getRevenueGraph } from "@/actions/get-revenue-graph";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { Overview } from "@/components/overview";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/utils/format-money";

type DashboardPageProps = {
  params: { storeId: string };
};

const DashboardPage = async (props: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(props.params.storeId);
  const salesCount = await getSalesCount(props.params.storeId);
  const stockCount = await getStockCount(props.params.storeId);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of Your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card.Root>
            <Card.Header className="flex flex-row justify-between space-y-0 pb-2">
              <Card.Title className="text-md font-medium">Total Revenue</Card.Title>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </Card.Header>
            <Card.Content>
              <div className="text-4xl font-bold">{formatMoney(totalRevenue)}</div>
            </Card.Content>
          </Card.Root>
          <Card.Root>
            <Card.Header className="flex flex-row justify-between space-y-0 pb-2">
              <Card.Title className="text-md font-medium">Sales</Card.Title>
              <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
            </Card.Header>
            <Card.Content>
              <div className="text-4xl font-bold">{salesCount}</div>
            </Card.Content>
          </Card.Root>
          <Card.Root>
            <Card.Header className="flex flex-row justify-between space-y-0 pb-2">
              <Card.Title className="text-md font-medium">Products In Stock</Card.Title>
              <PackageIcon className="h-5 w-5 text-muted-foreground" />
            </Card.Header>
            <Card.Content>
              <div className="text-4xl font-bold">{stockCount}</div>
            </Card.Content>
          </Card.Root>
        </div>
        <Card.Root className="col-span-4">
          <Card.Header>
            <Card.Title>Overview</Card.Title>
          </Card.Header>
          <Card.Content className="pl-2">
            <Overview data={await getRevenueGraph(props.params.storeId)} />
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
};

export default DashboardPage;
