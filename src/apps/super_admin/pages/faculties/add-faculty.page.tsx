import ContainerLayout from "@/components/page-layouts/container-layout";
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