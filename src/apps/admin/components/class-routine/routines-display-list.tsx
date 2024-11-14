import { Card, CardContent } from "@/components/ui/card";
import { TClassRoutine } from "@/types/class-routine.type";
import { useSearchParams } from "react-router-dom";
import { useGetClassRoutines } from "./actions";
import { createQueryString } from "@/utils/create-query-string";
import { EDayOfWeek, ERoutineType, Role } from "@/types/global.type";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import ClassRoutineForm from "./class-routine.form";
import {
    DropdownMenu,
    DropdownMenuButtonItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppMutation } from "@/hooks/useAppMutation";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { QueryKey } from "@/react-query/queryKeys";
import { useAuth } from "@/contexts/auth-provider";
import { cn } from "@/lib/utils";
import { compareAsc, parse } from "date-fns";

export function ClassRoutinesDisplayList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClassRoutines({
        queryString: createQueryString({
            ...Object.fromEntries(searchParams.entries()),
            dayOfTheWeek: searchParams.get("dayOfTheWeek") ?? EDayOfWeek.MONDAY,
        }),
    });

    const sortedSchedule = useMemo(() => {
        if (!data?.data?.length) return [];

        return data.data.sort((a, b) => compareAsc(
            parse(a.startTime, 'HH:mm', new Date()),
            parse(b.startTime, 'HH:mm', new Date())
        ));
    }, [data]);

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

function ClassRoutineCard({ classRoutine }: { classRoutine: TClassRoutine }) {
    const { payload } = useAuth();

    const subjectTeacher = classRoutine.subject?.teacher
        ? classRoutine.subject?.teacher?.firstName + " " + classRoutine.subject?.teacher?.lastName
        : "**Not Assigned**";

    const className = classRoutine.classRoom?.parent
        ? classRoutine.classRoom?.parent?.name
        : classRoutine.classRoom?.name;

    const sectionName = classRoutine.classRoom?.parent
        ? classRoutine.classRoom?.name
        : undefined;

    return (
        <Card className={cn(
            "flex flex-col min-w-56",
            classRoutine.type === ERoutineType.BREAK && "bg-secondary"
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
                            payload?.role === Role.ADMIN && <ClassRoutineCardActions classRoutine={classRoutine} />
                        }
                    </header>
                    {
                        classRoutine.type === ERoutineType.CLASS && <p className="text-sm text-muted-foreground">{subjectTeacher}</p>
                    }
                </div>
                <div className="mt-2">
                    <p className="font-medium">{classRoutine.startTime} - {classRoutine.endTime}</p>
                    <p className="text-sm text-muted-foreground">
                        {className}
                        {sectionName ? ` - ${sectionName}` : ""}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

function ClassRoutineCardActions({ classRoutine }: { classRoutine: TClassRoutine }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { mutateAsync, isPending } = useAppMutation();

    const handleDelete = async () => {
        await mutateAsync({
            endpoint: QueryKey.CLASSROUTINE,
            method: "delete",
            id: classRoutine.id,
            invalidateTags: [QueryKey.CLASSROUTINE],
        });
    }

    return (
        <>
            <ResponsiveDialog
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                title="Edit class routine"
            >
                <ClassRoutineForm
                    classRoomId={classRoutine.id}
                    setIsOpen={setIsEditOpen}
                    defaultValues={{
                        classRoomId: classRoutine.classRoom?.id,
                        subjectId: classRoutine.subject?.id,
                        startTime: classRoutine.startTime,
                        endTime: classRoutine.endTime,
                        dayOfTheWeek: classRoutine.dayOfTheWeek,
                        type: classRoutine.type,
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
                    <DropdownMenuButtonItem className="text-destructive" onClick={() => setIsDeleteOpen(true)}>
                        <span>Delete</span>
                    </DropdownMenuButtonItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}