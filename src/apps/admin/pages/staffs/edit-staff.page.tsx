import ContainerLayout from "@/components/page-layouts/container-layout"
import StaffForm from "../../components/staffs/staff.form"
import { useNavigate, useParams } from "react-router-dom"
import { useGetStaff } from "../../components/staffs/actions"
import { useAuth } from "@/contexts/auth-provider"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export default function EditStaffPage() {
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
    const { setDynamicBreadcrumb } = useSidebar();

    const { data, isLoading } = useGetStaff({
        id,
        options: { enabled: !!id }
    });

    useEffect(() => {
        if (data) {
            setDynamicBreadcrumb([
                {
                    label: data?.firstName + ' ' + data?.lastName,
                    url: `/staffs/${data?.id}`,
                    isEdit: true,
                }
            ]);
        }
    }, [data]);

    if (isLoading) return <div className="p-5">Loading the staff info...</div>

    if (!data) navigate(`/${payload?.role}/staffs`);

    return (
        <StaffForm
            defaultValues={{
                ...data,
                profileImageId: data?.account?.profileImage?.url ?? null,
                facultyIds: data?.faculties.map(faculty => faculty.id) ?? []
            }}
            selectedDepartments={data?.faculties.map(faculty => ({ value: faculty.id, label: faculty.name })) ?? []}
        />
    )
}