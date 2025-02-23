import ContainerLayout from "@/components/page-layouts/container-layout";
import AdminForm from "../../components/users/admin-form";

export default function AddAdminPage() {

    return (
        <ContainerLayout
            title="Add Admin"
            description="Add a new admin to your school management system."
        >
            <AdminForm />
        </ContainerLayout>
    )
}