import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetLessonPlans } from "../../components/lesson-plan/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { DataTable } from "@/components/data-table/data-table";
import { lessonPlanColumns } from "../../components/lesson-plan/lesson-plan.columns";
import LessonPlanSearchFilters from "../../components/lesson-plan/lesson-plan-filters";
import { useNavigate } from "react-router-dom";

export default function LessonPlansListPage() {
    const navigate = useNavigate();

    return (
        <ContainerLayout
            title="Lesson Plans"
            description="Manage lesson plans"
            actionTrigger={
                <Button onClick={() => navigate('new')}>
                    <Plus />
                    New Lesson Plan
                </Button>
            }
        >
            <LessonPlansList />
        </ContainerLayout>
    )
}

function LessonPlansList() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetLessonPlans({
        queryString: createQueryString({
            search: searchParams.get("search"),
            subjectId: searchParams.get("subjectId"),
            classRoomId: searchParams.get("classRoomId"),
            sectionId: searchParams.get("sectionId"),
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            status: searchParams.get("status"),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={lessonPlanColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<LessonPlanSearchFilters />}
        />
    )
}