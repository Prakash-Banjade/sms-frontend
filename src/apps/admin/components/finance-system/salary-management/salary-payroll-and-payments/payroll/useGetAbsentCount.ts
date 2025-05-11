import { useGetAttendanceCounts } from "@/apps/admin/components/attendances/actions";
import { createQueryString } from "@/utils/create-query-string";

export default function useGetAbsentCount(date: string, accountId: string) {
    return useGetAttendanceCounts({
        queryString: createQueryString({
            month: new Date(date).getMonth() + 1,
            onlyMonthly: true,
            accountId
        }),
        options: { enabled: !!accountId } // fetch this data only when tab is monthly
    });
}