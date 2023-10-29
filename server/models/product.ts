export type Product = {
  id: number;
  name: string;
  price: number;
  quantityInStock: number;
  storeId: number;
  size: {
    id: number;
    name: string;
    value: string;
  };
  category: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
    value: string;
  };
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};
