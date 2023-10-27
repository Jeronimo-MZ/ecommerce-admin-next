export type CategoryWithoutBillboard = {
  id: number;
  name: string;
  billboardId: number;
  storeId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = CategoryWithoutBillboard & {
  billboard: {
    id: number;
    label: string;
    imageUrl: string;
  };
};
