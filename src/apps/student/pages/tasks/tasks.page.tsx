import ContainerLayout from "@/components/page-layouts/container-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ETask } from "@/types/global.type";
import { createQueryString } from "@/utils/create-query-string";
import { z } from "zod";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetTaskCounts } from "../../data-access/tasks-data-access";
import { EvaluatedTasks, PendingTasks, SubmittedTasks } from "../../components/tasks/task-tabs-content";
import SearchInput from "@/components/search-components/search-input";

type Props = {
    type: ETask;
}

enum ETabs {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    EVALUATED = 'evaluated',
}

const tabsSchema = z.nativeEnum(ETabs);

export default function TasksPage({ type }: Props) {
    return (
        <ContainerLayout
            title={`${type}s`}
            description={`View and manage your ${type}s`}
        >
            <TasksList type={type} />
        </ContainerLayout>
    )
}

function TasksList({ type }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { success, data: tab } = tabsSchema.safeParse(searchParams.get('tab'));

    const currentTab = success ? tab : ETabs.PENDING;

    const { data, isLoading } = useGetTaskCounts({
        queryString: createQueryString({
            taskType: type,
        }),
        options: {
            enabled: type === ETask.ASSIGNMENT, // only fetch task counts for assignments
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchInput label={`Search ${type}s`} className="max-w-[300px]" />

                <Button variant={'outline'}>Filter</Button>
            </div>

            {
                type === ETask.ASSIGNMENT ? (
                    <Tabs defaultValue={currentTab} onValueChange={(tab) => setSearchParams('tab', tab)} className="w-full">
                        <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value={ETabs.PENDING}>
                                Pending <span className="ml-2 size-5 flex items-center justify-center text-primary-foreground rounded-full bg-primary">{data?.pending}</span>
                            </TabsTrigger>
                            <TabsTrigger value={ETabs.SUBMITTED}>
                                Submitted <span className="ml-2 size-5 flex items-center justify-center text-primary-foreground rounded-full bg-primary">{data?.submitted}</span>
                            </TabsTrigger>
                            <TabsTrigger value={ETabs.EVALUATED}>
                                Evaluated <span className="ml-2 size-5 flex items-center justify-center text-primary-foreground rounded-full bg-primary">{data?.evaluated}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={ETabs.PENDING} className="mt-6">
                            <PendingTasks type={type} />
                        </TabsContent>

                        <TabsContent value={ETabs.SUBMITTED} className="mt-6">
                            <SubmittedTasks />
                        </TabsContent>

                        <TabsContent value={ETabs.EVALUATED} className="mt-6">
                            <EvaluatedTasks />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <PendingTasks type={type} />
                )
            }
        </>
    )
}