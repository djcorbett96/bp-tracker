"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, History, ChartBar } from "lucide-react";
import Navbar from "@/components/navBar";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useUser();
  const router = useRouter();
  return (
    <>
      <Navbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col row-start-2 items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl">Blood Pressure Tracker</h1>
            <p className="font-light">By DJ Corbett</p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            {!user && (
              <p className="text-center text-red-800">
                Log in to track your readings!
              </p>
            )}
            <Button
              className="w-48 hover:bg-primary/90 hover:cursor-pointer"
              onClick={() => router.push("/reading")}
              disabled={user ? false : true}
            >
              <Plus className="mr-2 h-4 w-4" />
              Record New
            </Button>
            <Button
              className="w-48 hover:bg-primary/90 hover:cursor-pointer"
              onClick={() => router.push("/history")}
              disabled={user ? false : true}
            >
              <History className="mr-2 h-4 w-4" />
              See History
            </Button>
            <Button
              className="w-48 hover:bg-primary/90 hover:cursor-pointer"
              onClick={() => router.push("/analytics")}
              disabled={user ? false : true}
            >
              <ChartBar className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
