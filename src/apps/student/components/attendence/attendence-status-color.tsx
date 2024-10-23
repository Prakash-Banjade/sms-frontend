import { cn } from "@/lib/utils"
import { EAttendanceStatus } from "@/types/global.type"

export const statusColors: Record<EAttendanceStatus, string> = {
    present: "bg-green-500",
    absent: "bg-red-500",
    leave: "bg-yellow-500",
    late: "bg-orange-500",
}

const AttendenceStatus = () => {
    return (

        <div className="flex flex-wrap gap-4">
            {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center">
                    <div className={cn("w-4 h-4 rounded-full mr-1", color)}></div>
                    <span className="text-sm capitalize">{status}</span>
                </div>
            ))}
        </div>

    )
}

export default AttendenceStatus