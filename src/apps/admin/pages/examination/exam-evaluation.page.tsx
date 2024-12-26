import { Navigate, useParams } from "react-router-dom"
import { useGetExam, useGetExamStudents } from "../../components/examination/data-access";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Badge } from "@/components/ui/badge";
import ExamEvaluationForm from "../../components/examination/exam-evaluation/exam-evaluation-form";
import { createQueryString } from "@/utils/create-query-string";
import { TExamSubject } from "@/types/examination.type";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-provider";

export default function ExamEvaluationPage() {
    const params = useParams();
    const { payload } = useAuth();

    const { data: exam, isLoading } = useGetExam({
        id: params.id!,
        queryString: createQueryString({
            // onlyPast: true,
            includeExamSubjects: true, // TODO: remove this
        }),
        options: { enabled: !!params.id }
    });

    if (isLoading) return <div>Loading...</div>;

    if (!exam && !isLoading) return <Navigate to={`/${payload?.role}/exam-setup`} />;

    return (
        <ContainerLayout
            title={`Exam Evaluation - ${exam?.examType.name}`}
            description={(
                <Badge variant="outline" className="text-sm">
                    {exam?.classRoom?.name}
                </Badge>
            )}
        >
            <EvaluationTable examId={params.id!} examSubjects={exam?.examSubjects ?? []} />
        </ContainerLayout>
    )
};

const EvaluationTable = ({ examId, examSubjects }: { examId: string, examSubjects: TExamSubject[] }) => {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    useEffect(() => {
        setSearchParams('optionalSubjectId', undefined); // Clear optional subject id on mount
    }, [])

    const { data: students, isLoading } = useGetExamStudents({ // no pagination
        id: examId,
        queryString: createQueryString({
            optionalSubjectId: searchParams.get('optionalSubjectId'),
        }),
        options: { enabled: !!examId }
    });

    if (!examSubjects?.length) return <p className="text-muted-foreground text-center my-20">No exams has held to be evaluated.</p>

    if (isLoading) return <div>Loading...</div>;

    return (
        <ExamEvaluationForm examSubjects={examSubjects} students={students ?? []} />
    )
}