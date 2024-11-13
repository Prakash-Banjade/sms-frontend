import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import GetstudentsForm from "../../components/students-management/change-class/get-students-form";
import { useState } from "react";
import { useGetStudents } from "../../components/students-management/student-actions";
import { ChangeClass_DataTable } from "../../components/students-management/change-class/students-dataTable";

export default function StudentChangeClassPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <ContainerLayout
            title="Change Class"
        >
            <GetstudentsForm setSearchQuery={setSearchQuery} />
            <StudentsTable searchQuery={searchQuery} />
        </ContainerLayout>
    )
}

function StudentsTable({ searchQuery }: { searchQuery: string }) {
    const { data, isLoading } = useGetStudents({
        queryString: searchQuery,
        options: {
            enabled: !!searchQuery,
        }
    })

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
        <ChangeClass_DataTable data={data?.data ?? []} />
    )

}