import ContainerLayout from "@/components/page-layouts/container-layout";
import FacultyForm from "../../components/faculties/faculty-form";
import { Navigate, useParams } from "react-router-dom";
import { useGetSingleFaculty } from "../../data-access/faculties-data-access";
import { useAuth } from "@/contexts/auth-provider";

export default function EditFacultyPage() {
    const params = useParams();

    return (
        <ContainerLayout
            title="Edit Faculty"
            description="Edit an existing faculty in the school."
        >
            <EditFacultyForm id={params.id!} />
        </ContainerLayout>
    )
}

const EditFacultyForm = ({ id }: { id: string }) => {
    const { payload } = useAuth();

    const { data, isLoading } = useGetSingleFaculty({ id });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to={`/${payload?.role}/faculties`} />;

    return <FacultyForm id={id} defaultValues={data} />
}