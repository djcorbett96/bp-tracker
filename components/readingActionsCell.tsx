"use client";

import { useUser } from "@stackframe/stack";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export function ReadingActionsCell({ readingId }: { readingId: number }) {
  const router = useRouter();
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
            try {
              await fetch("/api/readings", {
                method: "DELETE",
                body: JSON.stringify({ readingId: readingId, user: user?.id }),
              });
              router.refresh();
              toast("Reading deleted");
            } catch (error) {
              toast("Error deleting reading");
            }
          }}
        >
          <Trash className="h-4 w-4" />
          Delete Reading
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
