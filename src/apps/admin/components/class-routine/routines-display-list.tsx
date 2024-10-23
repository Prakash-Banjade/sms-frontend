import { Card, CardContent } from "@/components/ui/card";
import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys";
import { TClassRoutine, TClassRoutineResponse } from "@/types/class-routine.type";
import { useSearchParams } from "react-router-dom";

type Props = {}

export function ClassRoutinesDisplayList({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useFetchData<TClassRoutineResponse>({
        endpoint: QueryKey.CLASSROUTINE,
        queryKey: [QueryKey.CLASSROUTINE, searchParams.toString()],
        queryString: searchParams.toString(),
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