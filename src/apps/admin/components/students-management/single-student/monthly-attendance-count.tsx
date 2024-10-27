import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { useGetAttendanceCounts } from "../../attendances/actions";
import { createQueryString } from "@/utils/create-query-string";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    selectedMonth: string,
    setSelectedMonth: (value: string) => void,
}

const months: Record<number, string> = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
}

const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i)).reverse();

export default function MonthlyAttendanceCount() {
    const { setSearchParams, searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetAttendanceCounts({
        queryString: createQueryString({
            month: searchParams.get('month'),
            year: searchParams.get('year'),
        }),
    })

    const getPercentage = (count: number, total: number) => {
        return ((count / total) * 100).toFixed(2);
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                <Select
                    onValueChange={val => {
                        setSearchParams("month", val)
                    }}
                    defaultValue={(new Date().getMonth() + 1).toString()}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(months).map(([_, monthName], index) => (
                            <SelectItem key={index} value={(index).toString()}>{monthName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={val => {
                        setSearchParams("year", val)
                    }}
                    defaultValue={new Date().getFullYear().toString()}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year, index) => (
                            <SelectItem key={index} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {isLoading && <CountsLoadingSkeleton />}
            {data && !isLoading && (
                <div>
                    <h4 className="font-semibold mb-3">{months[data.monthly.month]} Attendance</h4>
                    <section className="grid grid-cols-2 gap-2">
                        <p>
                            Present: {data.monthly.present} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.monthly.present, data.monthly.total)}%)
                            </span>
                        </p>
                        <p>
                            Absent: {data.monthly.absent} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.monthly.absent, data.monthly.total)}%)
                            </span>
                        </p>
                        <p>
                            Late: {data.monthly.late} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.monthly.late, data.monthly.total)}%)
                            </span>
                        </p>
                        <p>
                            Leave: {data.monthly.leave} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.monthly.leave, data.monthly.total)}%)
                            </span>
                        </p>
                    </section>
                </div>
            )}
        </div >
    )
}

export function CountsLoadingSkeleton() {
    return (
        <div>
            <h4 className="font-semibold mb-3">
                <Skeleton className="h-6 w-32" />
            </h4>
            <section className="grid grid-cols-2 gap-2">
                {['Present', 'Absent', 'Late', 'Leave'].map((status) => (
                    <div key={status} className="flex flex-col">
                        <Skeleton className="h-5 w-full mb-1" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </section>
        </div>
    )
}