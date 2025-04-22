import { useSearchParams } from "react-router-dom";
import ExamTypeSelect from "../../components/examination/exam-type-select";
import { useMemo } from "react";
import { useGetExamSubjects } from "@/apps/admin/components/examination/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parse } from "date-fns";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { useGetActiveAcademicYear } from "@/apps/super_admin/data-access/academic-year-data-access";

export default function StudentExamRoutinePage() {
    const { data, isLoading } = useGetActiveAcademicYear({});

    function academicYear() {
        return isLoading
            ? <div className="h-4 w-56 rounded-md bg-secondary animate-pulse"></div>
            : <span>Academic year <strong>{data?.name}</strong></span>
    }

    return (
        <ContainerLayout
            title="Examination Routine"
            description={academicYear()}
        >
            <ExamTypeSelect />
            <ExamRoutineSection />
        </ContainerLayout>
    )
}

function ExamRoutineSection() {
    const [searchParams] = useSearchParams();

    const { examTypeId } = useMemo(() => {
        return {
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchParams]);

    const { data, isLoading } = useGetExamSubjects({
        queryString: createQueryString({
            take: 50,
            examTypeId,
            order: 'ASC'
        }),
        options: {
            enabled: !!examTypeId,
            staleTime: Infinity, // student can refresh at any time to get the latest
            gcTime: Infinity
        }
    })

    if (isLoading) return <div>Loading...</div>;

    if (!examTypeId) return <div className="h-[400px] grid place-items-center text-muted-foreground">Select exam type to view routines</div>

    if (!data?.data?.length) return <div className="h-[400px] grid place-items-center text-muted-foreground">No data found.</div>

    return (
        <section className="mt-4 rounded-md">
            <Table className="border">
                <TableHeader className="border bg-secondary/30">
                    <TableRow>
                        <TableHead className="border">Subject</TableHead>
                        <TableHead className="border">Exam Date</TableHead>
                        <TableHead className="border">Start Time</TableHead>
                        <TableHead className="border">Duration</TableHead>
                        <TableHead className="border">Venue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data?.map((examSubject) => (
                        <TableRow key={examSubject.id}>
                            <TableCell className="font-semibold border">{examSubject?.subjectName}</TableCell>
                            <TableCell className="border">{format(examSubject.examDate, 'dd MMM, EEE')}</TableCell>
                            <TableCell className="border">{format(parse(examSubject.startTime, "HH:mm", new Date()), "hh:mm a")}</TableCell>
                            <TableCell className="border">{examSubject.duration} Minutes</TableCell>
                            <TableCell className="border">{examSubject.venue}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}