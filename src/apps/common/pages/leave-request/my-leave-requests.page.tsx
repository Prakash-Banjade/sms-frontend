import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
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