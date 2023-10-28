"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumn = {
  id: number;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "value",
    header: "Abreviatura",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  { id: "Ações", cell: ({ row }) => <CellAction data={row.original} /> },
];
