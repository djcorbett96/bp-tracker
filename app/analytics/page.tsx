import { getLast10Averages, getReadingsForChart } from "@/app/actions";
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

export default async function AnalyticsPage() {
  const morningAverages = await getLast10Averages("AM");
  const nightAverages = await getLast10Averages("PM");
  const chartData = await getReadingsForChart();
  return (
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
            <CardContent className="text-lg">
              <p>
                <span className="font-bold">Systolic:</span>{" "}
                {Math.round(morningAverages.avg_systolic)}
              </p>
              <p>
                <span className="font-bold">Diastolic:</span>{" "}
                {Math.round(morningAverages.avg_diastolic)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Moon /> Night
              </CardTitle>
              <CardDescription>Average of last 10 readings</CardDescription>
            </CardHeader>
            <CardContent className="text-lg">
              <p>
                <span className="font-bold">Systolic:</span>{" "}
                {Math.round(nightAverages.avg_systolic)}
              </p>
              <p>
                <span className="font-bold">Diastolic:</span>{" "}
                {Math.round(nightAverages.avg_diastolic)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex w-full lg:w-2/3">
          <ReadingsLineChart
            data={chartData.map((row: any) => ({
              date: row.date,
              time: row.time,
              systolic: Number(row.systolic),
              diastolic: Number(row.diastolic),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
