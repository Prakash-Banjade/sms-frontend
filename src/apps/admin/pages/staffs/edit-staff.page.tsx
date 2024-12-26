import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import StaffForm from "../../components/staffs/staff.form"
import { useNavigate, useParams } from "react-router-dom"
import { useGetStaff } from "../../components/staffs/actions"
import { staffSchema } from "../../schemas/staff.schema"
import { useAuth } from "@/contexts/auth-provider"

type Props = {}

export default function EditStaffPage({ }: Props) {
    const params = useParams();

    return (
        <ContainerLayout
            title="Editing the staff"
            description="Have some changes and save changes."
        >

            <StaffEditForm id={params.id!} />
        </ContainerLayout>
    )
}

function StaffEditForm({ id }: { id: string }) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const { data, isLoading } = useGetStaff({
        id,
        options: { enabled: !!id }
    })

    if (isLoading) return <div className="p-5">Loading the staff info...</div>

    if (!data) navigate(`/${payload?.role}/staffs`);

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