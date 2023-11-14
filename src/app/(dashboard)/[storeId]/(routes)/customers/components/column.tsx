"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CustomerColumn = {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  createdAt: string;
};

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "totalOrders",
    header: "Número de Pedidos",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
