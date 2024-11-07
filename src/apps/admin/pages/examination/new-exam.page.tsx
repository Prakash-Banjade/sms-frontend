import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import GetExamSubjectsForm from "./get-exam-subjects-form"
import { useEffect, useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import ExamSetupForm from "../../components/examination/exams/exam-setup.form";
import { Check } from "lucide-react";
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
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedExamSubjects, setSelectedExamSubjects] = useState<any[]>([]);

    // const isSelectedWithRoll = useMemo(() => {
    //     return !selectedExamSubjects.some(student => (student.newRollNo === 0 || !student.newRollNo))
    // }, [selectedExamSubjects]);

    const { data, isLoading } = useGetSubjects({
        queryString: searchQuery,
        options: {
            enabled: !!searchQuery,
        }
    })

    useEffect(() => { // resetting selection when data changes
        setSelectedExamSubjects([]);
    }, [data]);

    if (isLoading) return <div>Loading...</div>;

    if (!searchQuery && !isLoading) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Select a class to set up an exam for.
        </section>
    )

    if ((!data?.data?.length && !isLoading && !!searchQuery) || !data) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            No subject(s) found.
        </section>
    )

    return (
        <>
            {/* <div className="rounded-md border overflow-hidden"> */}
                <ExamSetupForm subjects={data?.data ?? []} />
            {/* </div> */}

            {
                selectedExamSubjects.length > 0 && <section className="flex gap-2 items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {selectedExamSubjects.length} subject(s) selected.
                    </div>

                    {/* <ResponsiveDialog
                        isOpen={isFormOpen}
                        setIsOpen={setIsFormOpen}
                        title="Promote Student(s)"
                    >
                        "hi"
                    </ResponsiveDialog> */}
                </section>
            }
        </>
    )

}