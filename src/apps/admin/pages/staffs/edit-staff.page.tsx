import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import StaffForm from "../../components/staffs/staff.form"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useGetStaff } from "../../components/staffs/actions"
import { staffSchema } from "../../schemas/staff.schema"

type Props = {}

export default function EditStaffPage({ }: Props) {
    const params = useParams();

    return (
        <ContainerLayout
            title="Editing the staff"
            description="Have some changes and save changes."
        >
            {
                !!params.id
                    ? <StaffEditForm id={params.id} />
                    : <Navigate to="/admin/staffs" />
            }
        </ContainerLayout>
    )
}

function StaffEditForm({ id }: { id: string }) {
    const navigate = useNavigate();

    const { data, isLoading } = useGetStaff({
        id,
    })

    if (isLoading) return <div className="p-5">Loading the staff info...</div>

    if (!data) navigate('/admin/staffs');

    const { data: filteredValues } = staffSchema.safeParse(data);

    return (
        <StaffForm
            defaultValues={{
                ...filteredValues,
                profileImageId: data?.profileImage?.url ?? null,
            }}
        />
    )
}