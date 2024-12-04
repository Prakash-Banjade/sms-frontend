import AppForm from "@/components/forms/app-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ISO_TIME } from "@/CONSTANTS";
import { cn } from "@/lib/utils";
import { createQueryString } from "@/utils/create-query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    setSearchQuery: (value: string) => void;
}

const getAttendancesSchema = z.object({
    date: z.date(),
})

type TGetAttendancesSchema = z.infer<typeof getAttendancesSchema>

export default function GetEmployeesAttendancesForm({ setSearchQuery }: Props) {
    const form = useForm<TGetAttendancesSchema>({
        resolver: zodResolver(getAttendancesSchema),
        defaultValues: {
            date: new Date(),
        },
    })

    const onSubmit = (values: TGetAttendancesSchema) => {
        setSearchQuery(createQueryString({
            date: format(values.date, 'yyyy-MM-dd') + ISO_TIME,
        }))
    }
    return (
        <AppForm schema={getAttendancesSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 mt-5">
                <section className="space-y-2">
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full md:w-[240px] justify-start text-left font-normal",
                                        !form.watch('date') && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch('date') ? format(form.watch('date'), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={form.watch('date')}
                                    onSelect={val => {
                                        form.setValue("date", val ?? new Date())
                                    }}
                                    initialFocus
                                    disabled={(date) => date > new Date() || date < new Date(new Date().getFullYear(), 0, 1)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </section>
                <Button type="submit" className="self-end" disabled={!form.watch('date')}>
                    Get Attendances
                </Button>
            </form>
        </AppForm>
    )
}