import { useGetTasks } from "@/apps/admin/components/tasks/action";
import { taskColumns } from "@/apps/admin/components/tasks/task.column";
import { DataTable } from "@/components/data-table/data-table";
import { ETask } from "@/types/global.type";
import { createQueryString } from "@/utils/create-query-string";

const AssignmentPage = () => {
    const { data, isLoading } = useGetTasks({
        queryString: createQueryString({
            taskType: ETask.ASSIGNMENT,
        }),
    });
    console.log("🚀 ~ AssignmentPage ~ data:", data);
    if (isLoading) return <div>Loading...</div>;
    if (!data) return <div>No Assignment Available</div>;

    return (
        <DataTable
            columns={taskColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    );
};

export default AssignmentPage;
