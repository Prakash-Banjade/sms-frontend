import ContainerLayout from "@/components/page-layouts/container-layout"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import StudentForm from "../../components/students-management/student.form."

export default function NewRegistrationPage() {
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
            <StudentForm />
        </ContainerLayout>
    )
}