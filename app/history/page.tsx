import { getReadings } from "@/app/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function Page() {
  const readings = await getReadings({ page: 1, limit: 25 });
  return (
    <div className="container mx-auto py-10 px-6 gap-4 flex flex-col">
      <Link href="/" className="mb-4">
        <Button className="hover:bg-primary/90 hover:cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-center text-2xl font-bold mb-4">
        Historical Readings
      </h1>
      <DataTable columns={columns} data={readings} />
    </div>
  );
}
