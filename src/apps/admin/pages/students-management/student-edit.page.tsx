import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { studentSchema } from "../../schemas/student.schema"
import { useGetStudent } from "../../components/students-management/student-actions";
import StudentForm from "../../components/students-management/student.form.";
import { useMemo } from "react";

type Props = {}

export default function EditStudentPage({ }: Props) {
    const params = useParams();

    return (
        <ContainerLayout
            title="Editing the student"
            description="Have some changes and save changes."
        >
            {
                !!params.id
                    ? <StudentEditForm id={params.id} />
                    : <Navigate to="/" /> // TODO: provide a meaningful route
            }
        </ContainerLayout>
    )
}

function StudentEditForm({ id }: { id: string }) {
    const navigate = useNavigate();

    const { data, isLoading } = useGetStudent({
        id,
    })

    const { data: filteredValues } = useMemo(() => {
        return studentSchema.safeParse({
            ...data,
            classRoomId: data?.classRoom?.parent?.id ? data?.classRoom?.parent?.id : data?.classRoom?.id,
            sectionId: data?.classRoom?.parent?.id ? data?.classRoom?.id : undefined,
            dormitoryRoomId: data?.dormitoryRoom?.id ?? undefined,
            additionalNotes: data?.additionalNotes ?? undefined,
            previousSchoolDetails: data?.previousSchoolDetails ?? undefined,
            profileImageId: data?.profileImage?.url ?? undefined,
        });
    }, [data])

    if (isLoading) return <div className="p-5">Loading the student info...</div>

    if (!data) navigate('/') // TODO: provide a meaningful route

    return (
        <StudentForm
            defaultValues={filteredValues}
        />
    )
}