import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { useNavigate, useParams } from "react-router-dom"
import { createStudentSchema } from "../../schemas/student.schema"
import { useGetStudent } from "../../components/students-management/student-actions";
import StudentForm from "../../components/students-management/student.form.";
import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-provider";

type Props = {}

export default function EditStudentPage({ }: Props) {
    const params = useParams();

    return (
        <ContainerLayout
            title="Editing the student"
            description="Have some changes and save changes."
        >
            <StudentEditForm id={params.id!} />
        </ContainerLayout>
    )
}

function StudentEditForm({ id }: { id: string }) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const { data, isLoading } = useGetStudent({ id });

    const { data: filteredValues, error } = useMemo(() => {
        if (!data) return { data: undefined, error: undefined };

        return createStudentSchema.safeParse({
            ...data,
            classRoomId: data?.classRoom?.parent?.id ? data?.classRoom?.parent?.id : data?.classRoom?.id,
            sectionId: data?.classRoom?.parent?.id ? data?.classRoom?.id : undefined,
            dormitoryRoomId: data?.dormitoryRoom?.id ?? undefined,
            additionalNotes: data?.additionalNotes ?? undefined,
            previousSchoolDetails: data?.previousSchoolDetails ?? undefined,
            profileImageId: data?.account?.profileImage?.url ?? undefined,
            routeStopId: data?.routeStop?.id ?? undefined,
            documentAttachmentIds: data?.documentAttachments?.map(attachment => attachment.id) ?? [],
        });
    }, [data])

    if (error) console.log(error, filteredValues); // TODO: handle the error and remove log, use schema.partial() to get only the valid fields

    if (isLoading) return <div className="p-5">Loading the student info...</div>

    if (!data) navigate(`/${payload?.role}/students`);

    return (
        <StudentForm
            defaultValues={filteredValues ?? {}}
            documentAttachments={data?.documentAttachments ?? []}
            defaultRouteStopOption={
                data?.routeStop
                    ? { value: data.routeStop?.id, label: data.routeStop?.name }
                    : undefined
            }
        />
    )
}