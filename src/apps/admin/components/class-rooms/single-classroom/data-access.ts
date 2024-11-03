import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { UseQueryOptions } from "@tanstack/react-query";

export type TClassRoomAttendanceStatisticsByDay = {
    attendanceDate: string,
    totalPresentStudentsCount: string,
    totalAbsentStudentsCount: string,
    totalLateStudentsCount: string,
    totalLeaveStudentsCount: string,
}[]

export enum ClassRoomAttendancePeriod {
    THIS_WEEK = 'thisWeek',
    PAST_7_DAYS = 'past7Days',
    PAST_30_DAYS = 'past30Days',
    THIS_MONTH = 'thisMonth',
}

export const useGetClassRoomAttendanceStatisticsByDay = ({
    queryString,
    options,
    id,
}: {
    id: string,
    queryString: string;
    options?: Partial<UseQueryOptions<TClassRoomAttendanceStatisticsByDay>>;
}) => {
    const response = useFetchData<TClassRoomAttendanceStatisticsByDay>({
        endpoint: `${QueryKey.CLASSES}/${id}/attendance-statistics`,
        queryKey: [QueryKey.CLASSES, id, 'attendance-statistics', queryString],
        queryString,
        options,
    })

    return response;
}