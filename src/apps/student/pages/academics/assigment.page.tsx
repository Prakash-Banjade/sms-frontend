
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { ETask } from "@/types/global.type";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useMemo } from "react";
import TaskDisplay from "../../components/task/assignments/task-display";

type Props = {
    type: ETask;
};

enum ETaskStatus {
    ACTIVE = "false",
    INACTIVE = "true",
}

const StudentTaskPage = ({ type }: Props) => {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    useEffect(() => {
        // Set default "overdue" param if it doesn't exist
        if (!searchParams.get("overdue")) {
            setSearchParams("overdue", ETaskStatus.ACTIVE);
        }
    }, [searchParams, setSearchParams]);
    const defaultTab = useMemo(() => {
        const status = searchParams.get("overdue");
        if (status) {
            return Object.values(ETaskStatus).includes(status as ETaskStatus)
                ? status
                : ETaskStatus.ACTIVE;
        }
        return ETaskStatus.ACTIVE;
    }, [searchParams]);

    const setCurrentTab = (status: string) => {
        setSearchParams("overdue", status);
    };


    return (
        <div className="container mx-auto">
            <h2 className="text-lg font-semibold mb-6 capitalize">{`My ${type}`}</h2>
            <Tabs
                defaultValue={defaultTab}
                className="w-full my-6"
                onValueChange={setCurrentTab}
            >
                <TabsList className="flex justify-evenly space-x-4   bg-foreground py-1 rounded-lg shadow-md">
                    {Object.values(ETaskStatus).map((status) => (
                        <TabsTrigger
                            key={status}
                            value={status}
                            className={`
                                capitalize px-4 py-2 text-base rounded
                                transition duration-200
                                ${status === defaultTab ? "bg-muted-foreground text-primary-foreground" : "text-primary-foreground bg-foreground "}
                                focus:outline-none
                            `}
                        >
                            {status === ETaskStatus.ACTIVE ? "Active" : "Inactive"}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <TaskDisplay type={type} />
        </div>
    );
};

export default StudentTaskPage;
