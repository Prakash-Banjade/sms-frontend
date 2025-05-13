import ContainerLayout from "@/components/page-layouts/container-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createQueryString } from "@/utils/create-query-string";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { DataTable } from "@/components/data-table/data-table";
import { lessonPlanColumns } from "../../components/lesson-plan/lesson-plan.columns";
import LessonPlanSearchFilters from "../../components/lesson-plan/lesson-plan-filters";
import { useNavigate } from "react-router-dom";
import { CLASS_ROOM_SEARCH_KEY, FACULTY_SEARCH_KEY } from "@/components/search-components/class-room-search";
import { useGetLessonPlans } from "../../data-access/lesson-plan-data-access";
import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";

export default function LessonPlansListPage() {
    const navigate = useNavigate();
    const { payload } = useAuth();

    return (
        <ContainerLayout
            title="Lesson Plans"
            description="Manage lesson plans"
            actionTrigger={
                payload?.role === Role.TEACHER && (
                    <Button onClick={() => navigate('new')}>
                        <Plus />
                        New Lesson Plan
                    </Button>
                )
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
            [FACULTY_SEARCH_KEY]: searchParams.get(FACULTY_SEARCH_KEY),
            [CLASS_ROOM_SEARCH_KEY]: searchParams.get(CLASS_ROOM_SEARCH_KEY),
            subjectId: searchParams.get("subjectId"),
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