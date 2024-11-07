import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
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