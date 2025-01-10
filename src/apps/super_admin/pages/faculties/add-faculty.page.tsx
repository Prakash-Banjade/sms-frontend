import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import FacultyForm from "../../components/faculties/faculty-form";


export default function AddFacultyPage() {
    return (
        <ContainerLayout
            title="Add Faculty"
            description="Add a new faculty to the school."
        >
            <FacultyForm />
        </ContainerLayout>
    )
}