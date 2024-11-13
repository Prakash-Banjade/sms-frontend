import { useGetExamTypes } from "@/apps/admin/components/examination/data-access";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import ExamRoutine from "../../components/exam/exam-routine";


const StudentExamRoutinePage = () => {
    const { data: examType, isLoading: isExamTypeLoading } = useGetExamTypes({
    });

    if (isExamTypeLoading) return <div>Loading...</div>;
    if (!examType) return <div>No  exam type</div>
    return (
        <div className="mx-auto container flex flex-col gap-6">

            <h2 className="text-lg font-semibold">Exam Routine</h2>
            <FacetedFilter title="Select Exam Type" searchKey="search" options={examType!.data?.map(type => ({
                label: type.name,
                value: type.name
            }))} />
            <section>
                <ExamRoutine />
            </section>

        </div>
    )
}

export default StudentExamRoutinePage
