import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type Props = {}

export default function NewRegistrationPage({ }: Props) {
    return (
        <ContainerLayout
            title="New Registration"
            description="Enroll a new student by filling the form below."
            actionTrigger={
                <Button type="button">
                    <Download />
                    Download Registration Form
                </Button>
            }
        >
            <div>New Registration Page</div>
        </ContainerLayout>
    )
}