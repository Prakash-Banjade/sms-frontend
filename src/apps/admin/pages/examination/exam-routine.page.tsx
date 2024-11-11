import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import GetExamSubjectsForm from "../../components/examination/exams/get-exam-subjects-form";
import { useMemo, useState } from "react";
import { useGetExamSubjects } from "../../components/examination/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parse } from "date-fns";
import { TExamSubject_Raw } from "@/types/examination.type";
import ExamRoutinePrint from "../../components/examination/exam-routine/exam-routine-print-preview";

export default function ExamRoutinePage() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <ContainerLayout
            title="Exam Routine"
        >
            <GetExamSubjectsForm setSearchQuery={setSearchQuery} />
            <ExamRoutineSection searchQuery={searchQuery} />
        </ContainerLayout>
    )
}

function ExamRoutineSection({ searchQuery }: { searchQuery: string }) {
    const { classRoomId, sectionId, examTypeId } = useMemo(() => {
        const searchParams = new URLSearchParams(searchQuery);
        return {
            classRoomId: searchParams.get('classRoomId'),
            sectionId: searchParams.get('sectionId'),
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchQuery])

    const { data, isLoading } = useGetExamSubjects({
        queryString: createQueryString({
            take: 50,
            classRoomId: sectionId ?? classRoomId,
            examTypeId,
            order: 'ASC'
        }),
        options: {
            enabled: (!!classRoomId && !!examTypeId)
        }
    })

    if (isLoading) return <div>Loading...</div>;

    if (!classRoomId || !examTypeId) return <div className="h-[400px] grid place-items-center text-muted-foreground">Select class room and exam type to view routines</div>

    if (!data?.data?.length) return <div className="h-[400px] grid place-items-center text-muted-foreground">No data found.</div>

    return (
        <section className="mt-4">
            <ExamRoutineTable subjects={data?.data ?? []} />
            <section className="flex justify-center mt-5">
                <ExamRoutinePrint examSubjects={data?.data ?? []} />
            </section>
        </section>
    )
}

export function ExamRoutineTable({ subjects }: { subjects: TExamSubject_Raw[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Full Mark</TableHead>
                    <TableHead>Pass Mark</TableHead>
                    <TableHead>Venue</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subjects?.map((examSubject) => (
                    <TableRow key={examSubject.id}>
                        <TableCell className="font-medium">{examSubject?.subjectName}</TableCell>
                        <TableCell>{new Date(examSubject.examDate).toDateString()}</TableCell>
                        <TableCell>{format(parse(examSubject.startTime, "HH:mm", new Date()), "hh:mm a")}</TableCell>
                        <TableCell>{examSubject.duration} Minutes</TableCell>
                        <TableCell>{examSubject.fullMark}</TableCell>
                        <TableCell>{examSubject.passMark}</TableCell>
                        <TableCell>{examSubject.venue}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}