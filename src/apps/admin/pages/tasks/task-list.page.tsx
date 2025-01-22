import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { useNavigate, useSearchParams } from "react-router-dom";
import { taskColumns } from "../../components/tasks/task.column";
import { useGetTasks } from "../../components/tasks/action";
import { createQueryString } from "@/utils/create-query-string";
import { ETask } from "@/types/global.type";
import TaskSearchFilters from "../../components/tasks/task-search-filters";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLASS_ROOM_SEARCH_KEY, FACULTY_SEARCH_KEY, SECTION_SEARCH_KEY } from "@/components/search-components/class-room-search";

type Props = {
    type: ETask;
}

export default function TasksPage({ type }: Props) {
    const navigate = useNavigate();

    return (
        <ContainerLayout
            title={`All ${type}s`}
            description={`View all ${type}s in your school management system.`}
            actionTrigger={
                <Button className="capitalize" onClick={() => navigate(`new`)}>
                    <Plus />
                    Add {type}
                </Button>
            }
        >
            <TasksList type={type} />
        </ContainerLayout>
    )
}

function TasksList({ type }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetTasks({
        queryString: createQueryString({
            search: searchParams.get("search"),
            [FACULTY_SEARCH_KEY]: searchParams.get(FACULTY_SEARCH_KEY),
            [CLASS_ROOM_SEARCH_KEY]: searchParams.get(CLASS_ROOM_SEARCH_KEY),
            [SECTION_SEARCH_KEY]: searchParams.get(SECTION_SEARCH_KEY),
            subjectId: searchParams.get("subjectId"),
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            taskType: type,
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={taskColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<TaskSearchFilters />}
        />
    )
}