import { useAuth } from "@/contexts/auth-provider";
import { Navigate, useParams } from "react-router-dom"

export default function DeleteClassRoomPage() {
    const { id } = useParams();
    const { payload } = useAuth();

    return <Navigate to={`/${payload?.role}/classes?delete=${id}`} />;
}