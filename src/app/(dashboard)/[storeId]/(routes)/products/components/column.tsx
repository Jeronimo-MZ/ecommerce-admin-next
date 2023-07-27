"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  isArchived: boolean;
  isFeatured: boolean;
  price: string;
  color: string;
  size: string;
  category: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "isArchived", header: "Archived" },
  { accessorKey: "isFeatured", header: "Featured" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "size", header: "Size" },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 uppercase">
        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
        {row.original.color}
      </div>
    ),
  },

  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
