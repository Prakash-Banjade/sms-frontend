import { Card, CardContent } from "@/components/ui/card";
import { TClassRoutine } from "@/types/class-routine.type";
import { useSearchParams } from "react-router-dom";
import { useGetClassRoutines } from "./actions";
import { createQueryString } from "@/utils/create-query-string";
import { EDayOfWeek } from "@/types/global.type";

type Props = {}

export function ClassRoutinesDisplayList({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClassRoutines({
        queryString: createQueryString({
            ...Object.fromEntries(searchParams.entries()),
            dayOfTheWeek: searchParams.get("dayOfTheWeek") ?? EDayOfWeek.MONDAY,
        }),
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        !!data?.data?.length
            ? <div className="flex gap-8 flex-wrap mt-8">
                {data?.data.map((classRoutine) => (
                    <ClassRoutineCard key={classRoutine.id} classRoutine={classRoutine} />
                ))}
            </div>
            : <div className="mt-16 text-muted-foreground text-center">**No class routines available for the selected day.**</div>
    )
}

function ClassRoutineCard({ classRoutine }: { classRoutine: TClassRoutine }) {
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
        <Card className="flex flex-col">
            <CardContent className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="font-semibold text-lg">{classRoutine.subject?.subjectName}</h3>
                    <p className="text-sm text-muted-foreground">{subjectTeacher}</p>
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