import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useEffect, useMemo, useState } from "react";
import GetstudentsForm from "../../components/students-management/change-class/get-students-form";
import { useGetStudents } from "../../components/students-management/student-actions";
import PromotionStudentsTable from "../../components/students-management/promotion/promotion-students-table";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import StudentPromotionForm from "../../components/students-management/promotion/promotion-form";


export default function StudentPromotionPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <ContainerLayout
            title="Student Promotion"
        >
            <GetstudentsForm setSearchQuery={setSearchQuery} />
            <StudentsTable searchQuery={searchQuery} />
        </ContainerLayout>
    )
}

export interface IStudenIdtWithRoll {
    studentId: string;
    newRollNo: number;
}

function StudentsTable({ searchQuery }: { searchQuery: string }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [studentsWithRoll, setStudentsWithRoll] = useState<IStudenIdtWithRoll[]>([]);

    const isSelectedWithRoll = useMemo(() => {
        return !studentsWithRoll.some(student => (student.newRollNo === 0 || !student.newRollNo))
    }, [studentsWithRoll]);

    const { data, isLoading } = useGetStudents({
        queryString: searchQuery,
        options: {
            enabled: !!searchQuery,
        }
    })

    useEffect(() => { // resetting selection when data changes
        setStudentsWithRoll([]);
    }, [data]);

    if (isLoading) return <div>Loading...</div>;

    if (!searchQuery && !isLoading) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Use above search to get student(s).
        </section>
    )

    if ((!data?.data?.length && !isLoading && !!searchQuery) || !data) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            No student(s) found.
        </section>
    )

    return (
        <>
            <div className="rounded-md border overflow-hidden">
                <PromotionStudentsTable setStudentsWithRoll={setStudentsWithRoll} students={data?.data ?? []} studentsWithRoll={studentsWithRoll} />
            </div>

            {
                studentsWithRoll.length > 0 && <section className="flex gap-2 items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {studentsWithRoll.length} student(s) selected.
                        {
                            !isSelectedWithRoll && <span className=""> Please select new roll no.</span>
                        }
                    </div>

                    <ResponsiveDialog
                        isOpen={isFormOpen}
                        setIsOpen={setIsFormOpen}
                        title="Promote Student(s)"
                    >
                        <StudentPromotionForm
                            setIsOpen={setIsFormOpen}
                            selectedStudentsWithRoll={studentsWithRoll}
                            searchQuery={searchQuery} // this is just to invalidate the fetched students
                        />
                    </ResponsiveDialog>

                    <Button
                        type="button"
                        onClick={() => setIsFormOpen(true)}
                        disabled={!isSelectedWithRoll}
                    >
                        <Check /> Promote
                    </Button>
                </section>
            }
        </>
    )

}