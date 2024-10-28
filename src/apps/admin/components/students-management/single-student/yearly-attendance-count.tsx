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
import { CountsLoadingSkeleton } from "./monthly-attendance-count";

const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i)).reverse();

export default function YearlyAttendanceCount() {
    const { setSearchParams, searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetAttendanceCounts({
        queryString: createQueryString({
            year: searchParams.get('year'),
        }),
    })

    const getPercentage = (count: number, total: number) => {
        return ((count / total) * 100).toFixed(2);
    }

    return (
        <div className="space-y-4">
            <Select
                onValueChange={val => {
                    setSearchParams("year", val)
                }}
                defaultValue={new Date().getFullYear().toString()}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year, index) => (
                        <SelectItem key={index} value={year.toString()}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isLoading && <CountsLoadingSkeleton />}
            {data && !isLoading && (
                <div>
                    <h4 className="font-semibold mb-3">{data.yearly.year} Attendance</h4>
                    <section className="grid grid-cols-2 gap-2">
                        <p>
                            Present: {data.yearly.present} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.yearly.present, data.yearly.total)}%)
                            </span>
                        </p>
                        <p>
                            Absent: {data.yearly.absent} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.yearly.absent, data.yearly.total)}%)
                            </span>
                        </p>
                        <p>
                            Late: {data.yearly.late} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.yearly.late, data.yearly.total)}%)
                            </span>
                        </p>
                        <p>
                            Leave: {data.yearly.leave} days
                            <span className="text-sm text-muted-foreground">{" "}
                                ({getPercentage(data.yearly.leave, data.yearly.total)}%)
                            </span>
                        </p>
                    </section>
                </div>
            )}
        </div >
    )
}