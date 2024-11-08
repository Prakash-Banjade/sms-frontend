import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import ExamSetupForm from "../../components/examination/exams/exam-setup.form";
import { Navigate, useParams } from "react-router-dom";
import { useGetExam } from "../../components/examination/data-access";
import { useGetSubjects } from "../../components/subjects/actions";
import { createQueryString } from "@/utils/create-query-string";
import { useEffect, useMemo, useState } from "react";
import GetExamSubjectsForm from "../../components/examination/exams/get-exam-subjects-form";
import { formatDateNumeric } from "@/utils/format-date";
import { TSingleExam } from "@/types/examination.type";
import { TExamSubjectsSchema } from "../../schemas/exam-setup.schema";
import { Badge } from "@/components/ui/badge";

export default function EditExamPage() {
    const params = useParams();

    const { data, isLoading } = useGetExam({ // fetching the exam
        id: params.id!,
    })

    const classRoomName = useMemo(() => {
        return data?.classRoom?.parent ? `${data?.classRoom?.parent?.name} - ${data?.classRoom?.name}` : data?.classRoom?.name
    }, [data])

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to="/admin/exam-setup" />

    return (
        <ContainerLayout
            title={"Update Exam"}
            description={
                <Badge variant="outline" className="text-sm">
                    {classRoomName}
                </Badge>
            }
        >
            <EditExamTable exam={data} />
        </ContainerLayout>
    )
}

function EditExamTable({ exam }: { exam: TSingleExam }) {
    const [searchQuery, setSearchQuery] = useState<string>('');

    // creating the querstring which is required in gettng the subject and exam setup form
    useEffect(() => {
        if (exam) {
            setSearchQuery(createQueryString({
                classRoomId: exam?.classRoom?.parent?.id || exam?.classRoom.id,
                sectionId: exam?.classRoom?.parent?.id ? exam?.classRoom.id : undefined,
                examTypeId: exam?.examType.id,
            }))
        }
    }, [exam]);

    // fetching the classroom subjects
    const { data: subjects, isLoading } = useGetSubjects({
        queryString: `${searchQuery}&examId=${exam?.id}`,
        options: { enabled: (!!exam && !!searchQuery) }
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <GetExamSubjectsForm
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                defaultExamType={{ value: exam?.examType.id, label: exam?.examType.name }}
            />
            <ExamSetupForm
                subjects={subjects?.data ?? []}
                examId={exam.id}
                searchQuery={searchQuery}
                defaultValues={{
                    examSubjects: subjects?.data?.map(subject => {
                        const examSubject = exam.examSubjects.find(examSubject => examSubject.subject?.id === subject.id);

                        if (!examSubject) return ({
                            isChecked: false,
                            examDate: "",
                            startTime: "",
                            duration: undefined,
                            fullMark: undefined,
                            passMark: undefined,
                            venue: "",
                            subjectId: subject.id,
                        }) as TExamSubjectsSchema["examSubjects"][0];

                        return ({
                            isChecked: true,
                            examDate: formatDateNumeric({ date: new Date(examSubject.examDate) }) ?? '',
                            startTime: examSubject.startTime,
                            duration: examSubject.duration,
                            fullMark: examSubject.fullMark,
                            passMark: examSubject.passMark,
                            venue: examSubject.venue,
                            subjectId: subject.id,
                        }) as TExamSubjectsSchema["examSubjects"][0];
                    }) ?? [],
                }}
            />
        </>
    )
}