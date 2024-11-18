import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Navigate, useParams } from "react-router-dom"
import { useGetLessonPlan } from "../../components/lesson-plan/data-access";
import LessonPlanForm from "../../components/lesson-plan/lesson-plan-form";


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
    const { data, isLoading } = useGetLessonPlan({
        id,
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to="/admin/lesson-plans" />;

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
                classRoomId: data.classRooms[0].parent?.id
                    ? data.classRooms[0].parent?.id
                    : data.classRooms[0].id,
                sectionIds: data.classRooms[0].parent?.id
                    ? data.classRooms?.map((classRoom) => classRoom.id)
                    : [],
            }}
        />
    )
}

