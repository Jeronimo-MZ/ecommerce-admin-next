"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: number;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Texto",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
