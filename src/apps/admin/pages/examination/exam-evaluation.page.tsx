import { Navigate, useParams } from "react-router-dom"
import { useGetExam, useGetExamStudents } from "../../components/examination/data-access";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Badge } from "@/components/ui/badge";
import { TSingleExam } from "@/types/examination.type";
import ExamEvaluationForm from "../../components/examination/exam-evaluation/exam-evaluation-form";

export default function ExamEvaluationPage() {
    const params = useParams();

    const { data: exam, isLoading } = useGetExam({
        id: params.id!,
        options: { enabled: !!params.id }
    });

    if (isLoading) return <div>Loading...</div>;

    if (!exam && !isLoading) return <Navigate to="/admin/exam-setup" />;

    return (
        <ContainerLayout
            title={`Exam Evaluation - ${exam?.examType.name}`}
            description={(
                <Badge variant="outline" className="text-sm">
                    {exam?.classRoom?.parent ? `${exam?.classRoom?.parent?.name} - ${exam?.classRoom?.name}` : exam?.classRoom?.name}
                </Badge>
            )}
        >
            <EvaluationTable examId={params.id!} examSubjects={exam?.examSubjects ?? []} />
        </ContainerLayout>
    )
};

const EvaluationTable = ({ examId, examSubjects }: { examId: string, examSubjects: TSingleExam['examSubjects'] }) => {
    const { data: students, isLoading } = useGetExamStudents({ id: examId });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ExamEvaluationForm examSubjects={examSubjects} students={students ?? []} />
    )
}