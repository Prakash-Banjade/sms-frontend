import LeaveRequestForm from "../../components/leave-request/leave-request-form"


const LeaveRequestPage = () => {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold"> Leave Request Form</h2>
            <LeaveRequestForm />
        </div>
    )
}

export default LeaveRequestPage
