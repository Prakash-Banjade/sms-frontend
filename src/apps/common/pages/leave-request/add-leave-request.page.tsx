import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import LeaveRequestForm from "../../components/leave-request/leave-request-form"

const AddLeaveRequestPage = () => {

    return (
        <ContainerLayout
            title="Make a Leave Request"
            description="Fill the form with the leave request details. Admin will make the decision."
        >
            <LeaveRequestForm />
        </ContainerLayout>
    )
}

export default AddLeaveRequestPage;
