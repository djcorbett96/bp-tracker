"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { addReading } from "@/app/actions";
import { toast } from "sonner";
import { useUser } from "@stackframe/stack";

const formSchema = z.object({
  systolic: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({
      required_error: "Systolic is required",
    })
  ),
  diastolic: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({
      required_error: "Diastolic is required",
    })
  ),
  date: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date({
      required_error: "Date is required",
    })
  ),
  time: z.enum(["AM", "PM"], {
    required_error: "Time is required",
  }),
});

export function ReadingForm() {
  const user = useUser();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      date: undefined,
      time: "PM",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addReading(user?.id, values);
    toast("Reading has been saved", {
      description: `${format(values.date, "MM/dd/yyyy")} ${values.time} ${values.systolic}/${values.diastolic}`,
    });
    router.push("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value as Date, "P")
                      ) : (
                        <span>04/03/1996</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value as Date | undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Time</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-row gap-0 w-full"
                >
                  {["AM", "PM"].map((option) => (
                    <ToggleGroupItem
                      key={option}
                      value={option}
                      className={cn(
                        "flex-1 cursor-pointer rounded-none border border-input px-3 py-2 text-sm font-medium ring-offset-background transition-colors",
                        option === "AM" && "rounded-l-md",
                        option === "PM" && "rounded-r-md border-l-0",
                        "bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      )}
                    >
                      {option === "AM" ? "Morning" : "Night"}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="systolic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Systolic</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={
                    typeof field.value === "number" ||
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diastolic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diastolic</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={
                    typeof field.value === "number" ||
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-4 justify-center">
          <Button
            className="hover:bg-primary/90 hover:cursor-pointer px-6"
            type="submit"
          >
            Submit
          </Button>
          <Button
            className="hover:bg-primary/10 hover:cursor-pointer px-6"
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              console.log("Reset");
              router.push("/");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
