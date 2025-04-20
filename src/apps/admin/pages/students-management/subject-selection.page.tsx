import ContainerLayout from "@/components/page-layouts/container-layout";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useMemo } from "react";
import { useGetStudents } from "../../components/students-management/student-actions";
import { createQueryString } from "@/utils/create-query-string";
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search";
import { useGetOptionalSubjects } from "../../components/students-management/subject-selection/data-access";
import SearchInput from "@/components/search-components/search-input";
import { TStudent_BasicInfoResponse } from "@/apps/admin/types/student.type";
import SubjectSelectionForm from "../../components/students-management/subject-selection/subject-selection.form";

export default function SubjectSelectionPage() {
    return (
        <ContainerLayout
            title="Optional Subject Selection"
            description="Assign optional subjects to student"
        >
            <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
                <ClassRoomSearchFilterInputs />
                <SearchInput placeholder="Name or ID" label="Search Student" className="min-w-max" />
            </section>
            <OptionalSubjectSelectionTable />
        </ContainerLayout>
    )
}

function OptionalSubjectSelectionTable() {
    const { searchParams } = useCustomSearchParams();

    const { classRoomId, sectionId } = useMemo(() => {
        return {
            classRoomId: searchParams.get('classRoomId'),
            sectionId: searchParams.get('sectionId'),
        }
    }, [searchParams])

    const { data: students, isLoading: isStudentsLoading } = useGetStudents<TStudent_BasicInfoResponse>({
        queryString: createQueryString({
            classRoomId,
            sectionId,
            onlyBasicInfo: true,
            search: searchParams.get('search'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
        options: { enabled: !!classRoomId }
    });

    const { data: subjects, isLoading: isLoadingSubjects } = useGetOptionalSubjects({
        queryString: createQueryString({
            classRoomId,
        }),
        options: { enabled: !!classRoomId }
    })

    if (!classRoomId) return <div className="h-[400px] grid place-items-center text-muted-foreground">Select classroom to view optional subjects</div>

    if (isStudentsLoading || isLoadingSubjects) return <div>Loading...</div>;
    if (!students?.data?.length) return <div className="h-[400px] grid place-items-center text-muted-foreground">No students found.</div>
    if (!subjects?.length) return <div className="h-[400px] grid place-items-center text-muted-foreground">No optional subjects found.</div>

    return (
        <section className="mt-4">
            <SubjectSelectionForm students={students?.data ?? []} subjects={subjects ?? []} studentsMeta={students.meta} />
        </section>
    )
}