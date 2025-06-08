"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type Reading = {
  id: number;
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
};

export const columns: ColumnDef<Reading>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.date), "MM/dd/yyyy");
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "systolic",
    header: "Systolic",
  },
  {
    accessorKey: "diastolic",
    header: "Diastolic",
  },
  {
    accessorKey: "id",
    header: "Actions",
  },
];
