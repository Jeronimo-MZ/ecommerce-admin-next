"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: number;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: string;
  paymentDate?: string;
  totalPrice: string;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  { accessorKey: "id", header: "Código" },
  { accessorKey: "customerName", header: "Cliente" },
  { accessorKey: "customerEmail", header: "Email" },
  { accessorKey: "totalPrice", header: "Total" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "paymentDate", header: "Data de Pagamento" },
  { accessorKey: "createdAt", header: "Data de Criação" },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
