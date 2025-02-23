import ContainerLayout from "@/components/page-layouts/container-layout";
import LeaveRequestList from "../../components/leave-request/leave-request-list";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyLeaveRequestsPage() {
    const navigate = useNavigate();

    return (
        <ContainerLayout
            title="My Leave Requests"
            actionTrigger={(
                <Button type="button" onClick={() => navigate("new")}>
                    Request Leave
                </Button>
            )}
        >
            <LeaveRequestList />
        </ContainerLayout>
    )
}