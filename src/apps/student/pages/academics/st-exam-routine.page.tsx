import { useGetExamSubjects, useGetExamTypes } from "@/apps/admin/components/examination/data-access";
import ExamRoutine from "../../components/exam/exam-routine";
import ExamTypeSelect from "../../components/exam/exam-select";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const StudentExamRoutinePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedExamType, setSelectedExamType] = useState<string | null>(searchParams.get("search") || null);

    // Fetch exam types for the dropdown
    const { data: examTypeData, isLoading: isExamTypeLoading } = useGetExamTypes({});

    // Fetch exam subjects only if an exam type is selected
    const { data: examSubjects, isLoading: isSubjectsLoading } = useGetExamSubjects({
        queryString: selectedExamType ? createQueryString({ search: selectedExamType }) : '',
        options: {
            enabled: (!!selectedExamType)
        }
    });

    // Update URL params and selected exam type when an exam type is chosen
    const handleExamTypeChange = (value: string) => {
        setSelectedExamType(value);
        setSearchParams({ search: value });
    };

    if (isExamTypeLoading) return <div>Loading exam types...</div>;

    return (
        <div className="mx-auto container flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Exam Routine</h2>
                <ExamTypeSelect
                    data={examTypeData?.data || []}
                    placeholder="Select Exam Type"
                    label="Exam Type"
                    onSelectChange={handleExamTypeChange}
                />
            </div>
            <section>
                {selectedExamType ? (
                    isSubjectsLoading ? (
                        <Skeleton className="h-40 w-full rounded-xl" />
                    ) : (
                        examSubjects && examSubjects.data.length > 0 ? (
                            <ExamRoutine data={examSubjects.data} />
                        ) : (
                            <div className="h-[400px] grid place-items-center text-muted-foreground">
                                No exam routine available
                            </div>
                        )
                    )
                ) : (
                    <div className="h-[400px] grid place-items-center text-muted-foreground">
                        Please select an exam type to view the routine
                    </div>
                )}
            </section>
        </div>
    );
};

export default StudentExamRoutinePage;
