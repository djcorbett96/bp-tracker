"use client";

import { useUser } from "@stackframe/stack";
import { deleteReading } from "@/app/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";

export function ReadingActionsCell({ readingId }: { readingId: number }) {
  const user = useUser();

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
            await deleteReading(user?.id, readingId);
            toast("Reading deleted");
          }}
        >
          <Trash className="h-4 w-4" />
          Delete Reading
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
