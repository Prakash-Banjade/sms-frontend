import ContainerLayout from "@/components/page-layouts/container-layout"
import StaffForm from "../../components/staffs/staff.form"

type Props = {}

export default function AddStaffPage({ }: Props) {
    return (
        <ContainerLayout
            title="Add a new staff"
            description="Fill the form with the staff details."
        >
            <StaffForm />
        </ContainerLayout>
    )
}