import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col row-start-2 items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-64" /> {/* Title */}
            <Skeleton className="h-4 w-32" /> {/* Subtitle */}
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-48" /> {/* Record New button */}
            <Skeleton className="h-10 w-48" /> {/* See History button */}
            <Skeleton className="h-10 w-48" /> {/* Analyze button */}
          </div>
        </main>
      </div>
    </>
  );
}
