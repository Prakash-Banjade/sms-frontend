import ContainerLayout from '@/components/page-layouts/container-layout'
import SubjectForm from '../../components/subjects/subject-form'

export default function AddSubjectPage() {

    return (
        <ContainerLayout
            title="Add Subject"
            description="Add a new subject to your school management system."
        >
            <SubjectForm />
        </ContainerLayout>
    )
}