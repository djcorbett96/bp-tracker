"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteReading } from "../actions";
import { toast } from "sonner";

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
    id: "actions",
    cell: ({ row }) => {
      const reading = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                await deleteReading(reading.id);
                toast("Reading deleted");
              }}
            >
              <Trash className="h-4 w-4" />
              Delete Reading
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
