import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, History, ChartBar } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center gap-8">
        <h1 className="text-4xl">Blood Pressure Tracker</h1>
        <div className="flex flex-col gap-4">
          <Link href="/reading">
            <Button className="w-48 hover:bg-primary/90 hover:cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Record New
            </Button>
          </Link>
          <Link href="/history">
            <Button className="w-48 hover:bg-primary/90 hover:cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              See History
            </Button>
          </Link>
          <Link href="/analytics">
            <Button className="w-48 hover:bg-primary/90 hover:cursor-pointer">
              <ChartBar className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
