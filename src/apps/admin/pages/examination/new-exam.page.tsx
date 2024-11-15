import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import GetExamSubjectsForm from "../../components/examination/exams/get-exam-subjects-form"
import ExamSetupForm from "../../components/examination/exams/exam-setup.form";
import { useGetSubjects } from "../../components/subjects/data-access";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useMemo } from "react";
import { createQueryString } from "@/utils/create-query-string";

export default function NewExamPage() {

    return (
        <ContainerLayout title="Set Up A New Exam">
            <GetExamSubjectsForm />
            <ExamSubjectsTable />
        </ContainerLayout>
    )
}

function ExamSubjectsTable() {
    const { searchParams } = useCustomSearchParams();

    const { classRoomId, examTypeId } = useMemo(() => {
        return {
            classRoomId: searchParams.get('classRoomId'),
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchParams])

    const { data, isLoading } = useGetSubjects({
        queryString: createQueryString({
            classRoomId,
            skipPagination: 'true',
        }),
        options: { enabled: !!classRoomId }
    })

    if (isLoading) return <div>Loading...</div>;

    if ((!classRoomId || !examTypeId) && !isLoading) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Select exam type and class
        </section>
    )

    if ((!data?.data?.length && !isLoading && !!classRoomId) || !data) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            No subject(s) found.
        </section>
    )

    return (
        <ExamSetupForm subjects={data?.data ?? []} />
    )

}