"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: number;
  name: string;
  price: string;
  color: string;
  size: string;
  category: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  { accessorKey: "name", header: "Nome" },
  // { accessorKey: "isArchived", header: "Archived" },
  // { accessorKey: "isFeatured", header: "Featured" },
  { accessorKey: "price", header: "Preço" },
  { accessorKey: "category", header: "Categoria" },
  { accessorKey: "size", header: "Tamanho" },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 uppercase">
        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
        {row.original.color}
      </div>
    ),
  },

  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
