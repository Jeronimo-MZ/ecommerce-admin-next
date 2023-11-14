import dayjs from "dayjs";

import { CustomerRepository } from "../../../../../../server/repositories/customer-repository";
import { CustomerClient } from "./components/client";
import { CustomerColumn } from "./components/column";

type CustomersPageProps = {
  params: { storeId: string };
};

const CustomersPage = async ({ params }: CustomersPageProps) => {
  const customerRepository = new CustomerRepository();
  const customers = await customerRepository.findMany({
    storeId: Number(params.storeId),
  });

  const formattedCustomers: CustomerColumn[] = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    totalOrders: customer.totalOrders,
    createdAt: dayjs(customer.createdAt).format("DD/MM/YYYY"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomerClient data={formattedCustomers} />
      </div>
    </div>
  );
};

export default CustomersPage;
