"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: number;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "value",
    header: "Cor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.value}
        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: row.original.value }} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  { id: "Ações", cell: ({ row }) => <CellAction data={row.original} /> },
];
