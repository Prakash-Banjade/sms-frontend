import { Button } from "@/components/ui/button"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { UseQueryResult } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { EAttendanceStatus } from "@/types/global.type";
import { TEntityWithAttendance } from "../../types/attendence.type";

type Props = {
    searchQuery: string,
    attendanceResponse: UseQueryResult<TEntityWithAttendance[], Error>
    employeeType: 'teacher' | 'staff' // this is used to invalidate queries
}

export default function MarkAsAbsentButton({ searchQuery, attendanceResponse, employeeType }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedDate = new URLSearchParams(searchQuery).get('date')!;

    const attendancesWithNoRecord = useMemo(() => {
        const data = attendanceResponse.data;

        if (!data) return [];

        return data.filter(employee => (!employee.attendance));

    }, [attendanceResponse.data]);

    const { mutateAsync, isPending } = useAppMutation();

    async function handleSubmit() {
        if (!attendancesWithNoRecord.length) return;

        const formattedAttendances = attendancesWithNoRecord.map(employee => {
            return {
                date: selectedDate, // this date is in iso format
                inTime: null,
                outTime: null,
                status: EAttendanceStatus.ABSENT,
                accountId: employee.account.id,
            }
        });

        await mutateAsync({
            endpoint: QueryKey.ATTENDANCES + '/batch',
            method: 'patch',
            data: {
                updatedAttendances: formattedAttendances,
            },
            invalidateTags: [employeeType === 'teacher' ? QueryKey.TEACHERS : QueryKey.STAFFS, QueryKey.ATTENDANCES],
        });
    }

    return (
        <>
            <ResponsiveAlertDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Mark as Absent"
                description="Are you sure you want to mark all employees without in-time record as absent? This cannot be reversed."
                action={handleSubmit}
                actionLabel="Yes, Mark as Absent"
                loadingText="Marking as Absent..."
                isLoading={isPending}
            />

            <section
                title={!attendancesWithNoRecord.length ? 'No employees without in-time record' : ''}
            >
                <Button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    disabled={!attendancesWithNoRecord.length}
                >
                    Mark as Absent
                </Button>
            </section>
        </>
    )
}