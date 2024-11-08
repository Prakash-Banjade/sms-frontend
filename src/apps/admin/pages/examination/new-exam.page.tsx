import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import GetExamSubjectsForm from "../../components/examination/exams/get-exam-subjects-form"
import { useState } from "react";
import ExamSetupForm from "../../components/examination/exams/exam-setup.form";
import { useGetSubjects } from "../../components/subjects/actions";

export default function NewExamPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <ContainerLayout title="Set Up A New Exam">
            <GetExamSubjectsForm setSearchQuery={setSearchQuery} />
            <ExamSubjectsTable searchQuery={searchQuery} />
        </ContainerLayout>
    )
}

function ExamSubjectsTable({ searchQuery }: { searchQuery: string }) {
    const { data, isLoading } = useGetSubjects({
        queryString: searchQuery,
        options: {
            enabled: !!searchQuery,
        }
    })

    if (isLoading) return <div>Loading...</div>;

    if (!searchQuery && !isLoading) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Select exam type and class
        </section>
    )

    if ((!data?.data?.length && !isLoading && !!searchQuery) || !data) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            No subject(s) found.
        </section>
    )

    return (
        <ExamSetupForm subjects={data?.data ?? []} searchQuery={searchQuery} />
    )

}