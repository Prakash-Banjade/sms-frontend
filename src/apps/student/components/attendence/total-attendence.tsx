import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns"; // Import format to format the date
import { Card } from "@/components/ui/card"; // Adjust the import path based on your project structure
import { TAttendence } from "@/types/attendence.type";

interface AttendanceStatusCounts {
    present: number;
    absent: number;
    leave: number;
    late: number;
}

type TotalAttendanceProps = {
    attendanceData: TAttendence[]
}

const TotalAttendence = ({ attendanceData }: TotalAttendanceProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const today = new Date();
        const currentMonth = format(today, "MM"); // Get the current month in yyyy-MM format
        setSearchParams({ month: currentMonth }); // Set search params to current month
    }, [setSearchParams]);

    // Calculate the totals for each attendance status
    const statusCounts: AttendanceStatusCounts = {
        present: 0,
        absent: 0,
        leave: 0,
        late: 0,
    };

    attendanceData.forEach(record => {
        const status = record.status;
        if (statusCounts.hasOwnProperty(status)) {
            console.log("🚀 ~ TotalAttendence ~ status:", statusCounts)

            statusCounts[status]++;
        } else {
            statusCounts[status] = 1; // 
        }
    });

    return (
        <div className="flex-1 space-y-6 items-center">
            <h2 className="text-2xl font-bold"> Current Month Report</h2>
            <div className=" grid grid-cols-2 gap-4">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Card key={status} className="p-4 flex flex-col gap-2">
                        <h3 className="text-lg font-semibold capitalize">{status}</h3>
                        <p className="text-2xl">{count}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default TotalAttendence;
