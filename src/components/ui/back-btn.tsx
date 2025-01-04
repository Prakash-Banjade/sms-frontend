import { useNavigate } from "react-router-dom"
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

export default function BackBtn() {
    const navigate = useNavigate();

    return (
        <Button variant={'link'} onClick={() => navigate(-1)} className="p-0">
            <ArrowLeft />
            Back
        </Button>
    )
}