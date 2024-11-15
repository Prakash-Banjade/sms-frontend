import { useGetExamReportByStudent, useGetExamTypes } from "@/apps/admin/components/examination/data-access";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ExamTypeSelectById from "../../components/exam-report/exam-type-select";
import ExamReportCard from "../../components/exam-report/exam-report-card";

const StudentExamReportPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedExamType, setSelectedExamType] = useState<string | null>(searchParams.get("examTypeId") || null);

    // Fetch exam types for the dropdown
    const { data: examTypeData, isLoading: isExamTypeLoading } = useGetExamTypes({});

    // Fetch exam subjects only if an exam type is selected
    const { data: examReportData, isLoading: isExamReportLoading } = useGetExamReportByStudent({
        queryString: searchParams.toString(),
        options: { enabled: !!selectedExamType }
    });

    // Update URL params and selected exam type when an exam type is chosen
    const handleExamTypeChange = (value: string) => {
        setSelectedExamType(value);
        setSearchParams({ examTypeId: value });
    };

    if (isExamTypeLoading) return <div>Loading exam types...</div>;

    return (
        <div className="mx-auto container flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Exam Report</h2>
                <ExamTypeSelectById
                    data={examTypeData?.data || []}
                    placeholder="Select Exam Type"
                    label="Exam Type"
                    onSelectChange={handleExamTypeChange}
                />
            </div>
            <section>
                {selectedExamType ? (
                    isExamReportLoading ? (
                        <Skeleton className="h-40 w-full rounded-xl" />
                    ) : (
                        examReportData && examReportData.examReport ? (

                            <ExamReportCard report={examReportData} />
                        ) : (
                            <div className="h-[400px] grid place-items-center text-muted-foreground">
                                No exam report available
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

export default StudentExamReportPage;
