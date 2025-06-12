export const dynamic = "force-dynamic";
import Navbar from "@/components/navBar";
import { ReadingsLineChart } from "@/components/readingsLineChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { stackServerApp } from "@/stack";

export default async function AnalyticsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const user = await stackServerApp.getUser({ or: "redirect" });
  const morningAveragesLeft = await fetch(
    `${baseUrl}/api/averages?userId=${user?.id}&timeOfDay=AM&arm=L`,
  ).then((res) => res.json());
  const morningAveragesRight = await fetch(
    `${baseUrl}/api/averages?userId=${user?.id}&timeOfDay=AM&arm=R`,
  ).then((res) => res.json());
  const nightAveragesLeft = await fetch(
    `${baseUrl}/api/averages?userId=${user?.id}&timeOfDay=PM&arm=L`,
  ).then((res) => res.json());
  const nightAveragesRight = await fetch(
    `${baseUrl}/api/averages?userId=${user?.id}&timeOfDay=PM&arm=R`,
  ).then((res) => res.json());
  const chartData = await fetch(`${baseUrl}/api/chart?userId=${user?.id}`).then(
    (res) => res.json(),
  );
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-6 flex flex-col">
        <Link href="/" className="mb-4">
          <Button className="hover:bg-primary/90 hover:cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-center text-4xl font-bold">Analytics</h1>
          <div className="grid grid-cols-2 gap-2 w-full lg:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sun /> Morning
                </CardTitle>
                <CardDescription>Average of last 10 readings</CardDescription>
              </CardHeader>
              <CardContent className="text-lg flex gap-2">
                <div className="flex flex-col gap-2 w-1/2 rounded-md border border-primary/20 p-2 bg-primary/10 text-primary/90">
                  <p className="font-bold">Left Arm: </p>
                  <p>{`${Math.round(morningAveragesLeft.averages.avg_systolic)} / ${Math.round(morningAveragesLeft.averages.avg_diastolic)} `}</p>
                </div>
                <div className="flex flex-col gap-2 w-1/2 rounded-md border border-primary/20 p-2 bg-primary/10 text-primary/90">
                  <p className="font-bold">Right Arm: </p>
                  <p>{`${Math.round(morningAveragesRight.averages.avg_systolic)} / ${Math.round(morningAveragesRight.averages.avg_diastolic)} `}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Moon /> Night
                </CardTitle>
                <CardDescription>Average of last 10 readings</CardDescription>
              </CardHeader>
              <CardContent className="text-lg flex gap-2">
                <div className="flex flex-col gap-2 w-1/2 rounded-md border border-primary/20 p-2 bg-primary/10 text-primary/90">
                  <p className="font-bold">Left Arm: </p>
                  <p>{`${Math.round(nightAveragesLeft.averages.avg_systolic)} / ${Math.round(nightAveragesLeft.averages.avg_diastolic)} `}</p>
                </div>
                <div className="flex flex-col gap-2 w-1/2 rounded-md border border-primary/20 p-2 bg-primary/10 text-primary/90">
                  <p className="font-bold">Right Arm: </p>
                  <p>{`${Math.round(nightAveragesRight.averages.avg_systolic)} / ${Math.round(nightAveragesRight.averages.avg_diastolic)} `}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex w-full lg:w-2/3">
            <ReadingsLineChart
              data={chartData?.readings?.map((row: any) => ({
                date: row.date,
                time: row.time,
                systolic: Number(row.systolic),
                diastolic: Number(row.diastolic),
              }))}
            />
          </div>
        </div>
      </div>
    </>
  );
}
