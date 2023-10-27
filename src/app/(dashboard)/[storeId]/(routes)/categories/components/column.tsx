"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: number;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "billboardLabel",
    header: "Texto da Capa",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
