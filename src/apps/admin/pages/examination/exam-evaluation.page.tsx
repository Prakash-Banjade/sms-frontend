import { Navigate, useParams } from "react-router-dom"
import { useGetExam, useGetExamStudents } from "../../components/examination/data-access";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { Badge } from "@/components/ui/badge";
import ExamEvaluationForm from "../../components/examination/exam-evaluation/exam-evaluation-form";
import { createQueryString } from "@/utils/create-query-string";
import { TExamSubject, TSingleExam } from "@/apps/admin/types/examination.type";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { ESubjectType } from "@/types/global.type";
import { SectionSearchFilters } from "@/components/search-components/section-search-filter";

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

    if (!exam) return <p className="text-muted-foreground text-center my-20">No exams has held to be evaluated.</p>;

    return (
        <ContainerLayout
            title={`Exam Evaluation - ${exam?.examType.name}`}
            description={(
                <Badge variant="outline" className="text-sm">
                    {exam?.classRoom?.name} - {exam?.classRoom?.faculty?.name}
                </Badge>
            )}
        >
            <EvaluationTable exam={exam} />
        </ContainerLayout>
    )
};

const EvaluationTable = ({ exam: { id, examSubjects, classRoom } }: { exam: TSingleExam }) => {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    useEffect(() => {
        const firstExamSubject = examSubjects[0].subject;
        setSearchParams('optionalSubjectId', firstExamSubject?.type === ESubjectType.Optional ? firstExamSubject.id : undefined);
    }, []);

    const { data: students, isLoading } = useGetExamStudents({ // no pagination
        id,
        queryString: createQueryString({
            optionalSubjectId: searchParams.get('optionalSubjectId'),
            sectionId: searchParams.get('sectionId'),
        }),
        options: { enabled: !!id }
    });

    if (!examSubjects?.length) return <p className="text-muted-foreground text-center my-20">No exams has held to be evaluated.</p>

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <section className="flex">
                <SectionSearchFilters classRoomId={classRoom?.id} />
            </section>
            <ExamEvaluationForm examSubjects={examSubjects} students={students ?? []} />
        </>
    )
}