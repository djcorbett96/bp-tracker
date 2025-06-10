export const dynamic = "force-dynamic";

import { getReadings } from "@/app/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navBar";
import { stackServerApp } from "@/stack";

type Reading = {
  id: number;
  date: Date;
  time: string;
  systolic: number;
  diastolic: number;
};

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("baseUrl: ", baseUrl);

  const user = await stackServerApp.getUser({ or: "redirect" });

  const readingsResponse = await fetch(
    `${baseUrl}/api/readings?userId=${user?.id}&page=1&limit=25`,
  ).then((res) => res.json());

  return (
    <>
      <Navbar />
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
        <DataTable
          columns={columns as any}
          data={readingsResponse.readings as any[]}
        />
      </div>
    </>
  );
}
