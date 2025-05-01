import ContainerLayout from "@/components/page-layouts/container-layout";
import { Navigate, useParams } from "react-router-dom"
import LessonPlanForm from "../../components/lesson-plan/lesson-plan-form";
import { useAuth } from "@/contexts/auth-provider";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useGetLessonPlan } from "../../data-access/lesson-plan-data-access";


export default function EditLessonPlanPage() {
    const params = useParams();

    return (
        <ContainerLayout
            title="Edit Lesson Plan"
        >
            <LessonPlanEditForm id={params.id!} />
        </ContainerLayout>
    )
}

function LessonPlanEditForm({ id }: { id: string }) {
    const { payload } = useAuth();
    const { setDynamicBreadcrumb } = useSidebar();
    const { data, isLoading } = useGetLessonPlan({ id });

    useEffect(() => {
        setDynamicBreadcrumb([
            {
                label: data?.title ?? '',
                url: `/lesson-plans/${data?.id}`,
                isEdit: true,
            }
        ])
    }, [data]);

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to={`/${payload?.role}/lesson-plans`} />;

    return (
        <LessonPlanForm
            lessonPlanId={id}
            attachments={data.attachments}
            defaultValues={{
                description: data.description,
                title: data.title,
                startDate: data.startDate,
                endDate: data.endDate,
                attachmentIds: data.attachments.map((attachment) => attachment.id),
                subjectId: data.subject.id,
                classRoomId: data.classRoom.parent
                    ? data.classRoom.parent?.id
                    : data.classRoom.id,
                sectionId: data.classRoom.parent
                    ? data.classRoom.id
                    : "",
                facultyId: data.classRoom?.faculty?.id
            }}
        />
    )
}

