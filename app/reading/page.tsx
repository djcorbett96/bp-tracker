import Navbar from "@/components/navBar";
import { ReadingForm } from "@/components/readingForm";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col row-start-2 items-center gap-8">
          <h1 className="text-2xl">New Blood Pressure Reading</h1>
          <ReadingForm />
        </main>
      </div>
    </>
  );
}
