import ContainerLayout from "@/components/page-layouts/container-layout"
import StaffForm from "../../components/staffs/staff.form"

export default function AddStaffPage() {
    return (
        <ContainerLayout
            title="Add a new staff"
            description="Fill the form with the staff details."
        >
            <StaffForm />
        </ContainerLayout>
    )
}