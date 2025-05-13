import { Card, CardContent } from "@/components/ui/card";
import { TClassRoutine } from "@/apps/admin/types/class-routine.type";
import { useSearchParams } from "react-router-dom";
import { useGetClassRoutines } from "./actions";
import { createQueryString } from "@/utils/create-query-string";
import { EDayOfWeek, ERoutineType } from "@/types/global.type";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import ClassRoutineForm from "./class-routine.form";
import { DestructiveDropdownMenuButtonItem, DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppMutation } from "@/hooks/useAppMutation";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { QueryKey } from "@/react-query/queryKeys";
import { useAuth } from "@/contexts/auth-provider";
import { cn, isAdmin, sortClassRoutines } from "@/lib/utils";
import { useFacultySearch } from "@/hooks/useFacultySearch";

export function ClassRoutinesDisplayList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClassRoutines({
        queryString: createQueryString({
            ...Object.fromEntries(searchParams.entries()),
            dayOfTheWeek: searchParams.get("dayOfTheWeek") ?? EDayOfWeek.MONDAY,
            skipPagination: true
        }),
    });

    const sortedSchedule = useMemo(() => sortClassRoutines(data?.data ?? []), [data]);

    if (isLoading) return <div>Loading...</div>;

    return (
        !!data?.data?.length
            ? <div className="flex gap-8 flex-wrap mt-8">
                {sortedSchedule.map((classRoutine) => (
                    <ClassRoutineCard key={classRoutine.id} classRoutine={classRoutine} />
                ))}
            </div>
            : <div className="mt-16 text-muted-foreground text-center">**No class routines available for the selected day.**</div>
    )
}

export function ClassRoutineCard({ classRoutine, className }: { classRoutine: TClassRoutine, className?: string }) {
    const { payload } = useAuth();

    const subjectTeacher = classRoutine?.teacher
        ? classRoutine.teacher.firstName + " " + classRoutine.teacher.lastName
        : "**Not Assigned**";

    return (
        <Card className={cn(
            "flex flex-col min-w-56",
            classRoutine.type === ERoutineType.BREAK && "bg-secondary",
            className
        )}>
            <CardContent className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <header className="flex items-center justify-between gap-5">
                        <h3 className="font-semibold text-lg">
                            {
                                classRoutine.type === ERoutineType.CLASS
                                    ? classRoutine.subject?.subjectName
                                    : "Break Time"
                            }
                        </h3>
                        {
                            isAdmin(payload) && <ClassRoutineCardActions classRoutine={classRoutine} />
                        }
                    </header>
                    {
                        classRoutine.type === ERoutineType.CLASS && <p className="text-sm text-muted-foreground">{subjectTeacher}</p>
                    }
                </div>
                <div className="mt-2">
                    <p className="font-medium">{classRoutine.startTime} - {classRoutine.endTime}</p>
                    <p className="text-sm text-muted-foreground">{classRoutine.classRoom?.fullName}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function ClassRoutineCardActions({ classRoutine }: { classRoutine: TClassRoutine }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { getFacultyIdByClassRoomId } = useFacultySearch(createQueryString({ include: "section" }));

    const { mutateAsync, isPending } = useAppMutation();

    const handleDelete = async () => {
        await mutateAsync({
            endpoint: QueryKey.CLASSROUTINE,
            method: "delete",
            id: classRoutine.id,
            invalidateTags: [QueryKey.CLASSROUTINE],
        });
    }

    const classRoomId = classRoutine.classRoom?.parent?.id ?? classRoutine.classRoom?.id;

    return (
        <>
            <ResponsiveDialog
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                title="Edit class routine"
                className="max-w-[800px]"
            >
                <ClassRoutineForm
                    classRoutineId={classRoutine.id}
                    setIsOpen={setIsEditOpen}
                    defaultValues={{
                        facultyId: getFacultyIdByClassRoomId(classRoomId),
                        classRoomId,
                        sectionId: classRoutine.classRoom?.parent?.id ? classRoutine.classRoom?.id : null,
                        subjectId: classRoutine.subject?.id,
                        startTime: classRoutine.startTime,
                        endTime: classRoutine.endTime,
                        daysOfTheWeek: [classRoutine.dayOfTheWeek],
                        type: classRoutine.type,
                        teacherId: classRoutine.teacher?.id,
                    }}
                />
            </ResponsiveDialog>
            <ResponsiveAlertDialog
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                title="Delete Class Routine"
                description="Are you sure you want to delete this class routine?"
                action={() => handleDelete()}
                actionLabel="Yes, Delete"
                isLoading={isPending}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                        <span>Edit Routine</span>
                    </DropdownMenuButtonItem>
                    <DestructiveDropdownMenuButtonItem onClick={() => setIsDeleteOpen(true)}>
                        <span>Delete</span>
                    </DestructiveDropdownMenuButtonItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}