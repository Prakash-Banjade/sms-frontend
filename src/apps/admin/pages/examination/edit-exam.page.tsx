import ContainerLayout from "@/components/page-layouts/container-layout";
import ExamSetupForm from "../../components/examination/exams/exam-setup.form";
import { Navigate, useParams } from "react-router-dom";
import { useGetExam } from "../../components/examination/data-access";
import { useGetSubjects } from "../../components/subjects/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { formatDateNumeric } from "@/utils/format-date";
import { TSingleExam } from "@/apps/admin/types/examination.type";
import { TExamSubjectsSchema } from "../../schemas/exam-setup.schema";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-provider";

export default function EditExamPage() {
    const params = useParams();
    const { payload } = useAuth();

    const { data, isLoading } = useGetExam({ // fetching the exam
        id: params.id!,
        queryString: "includeExamSubjects=true", // include exam subjects in the response
    })

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to={`/${payload?.role}/exam-setup`} />

    return (
        <ContainerLayout
            title={"Update Exam"}
            description={
                <Badge variant="outline" className="text-sm">
                    {data?.classRoom?.name} - {data?.classRoom?.faculty?.name}
                </Badge>
            }
        >
            <EditExamTable exam={data} />
        </ContainerLayout>
    )
}

function EditExamTable({ exam }: { exam: TSingleExam }) {
    // fetching the classroom all subjects
    const { data: subjects, isLoading } = useGetSubjects({
        queryString: createQueryString({
            classRoomId: exam?.classRoom.id,
            examTypeId: exam?.examType.id,
            skipPagination: 'true',
        }),
        options: { enabled: !!exam }
    })

    if (isLoading) return <div>Loading...</div>;

    if (!subjects) return <div>No subjects found</div>;

    return (
        <>
            <p className="font-semibold text-lg">
                {exam.examType.name}
            </p>
            <ExamSetupForm
                subjects={subjects?.data ?? []}
                examId={exam.id}
                defaultValues={{
                    examSubjects: subjects?.data?.map(subject => {
                        const examSubject = exam.examSubjects?.find(examSubject => examSubject.subject?.id === subject.id);

                        if (!examSubject) return ({
                            isChecked: false,
                            examDate: "",
                            startTime: "",
                            duration: undefined,
                            theoryFM: subject.theoryFM,
                            theoryPM: subject.theoryPM,
                            practicalFM: subject.practicalFM,
                            practicalPM: subject.practicalPM,
                            venue: "",
                            subjectId: subject.id,
                        }) as TExamSubjectsSchema["examSubjects"][0];

                        return ({
                            isChecked: true,
                            id: examSubject.id, // due to the presence of this id, exam subject id updated instead of complete replace
                            examDate: formatDateNumeric({ date: new Date(examSubject.examDate) }) ?? '',
                            startTime: examSubject.startTime,
                            duration: examSubject.duration,
                            practicalFM: examSubject.practicalFM,
                            practicalPM: examSubject.practicalPM,
                            theoryFM: examSubject.theoryFM,
                            theoryPM: examSubject.theoryPM,
                            venue: examSubject.venue,
                            subjectId: subject.id,
                        }) as TExamSubjectsSchema["examSubjects"][0];
                    }) ?? [],
                }}
            />
        </>
    )
}