import ClassRoutineForm from '../../components/class-routine/class-routine.form'
import ContainerLayout from '@/components/aside-layout.tsx/container-layout'

export default function AddClassRoutinePage() {

    return (
        <ContainerLayout
            title="Add New Class Routine"
            description="Select a class, assign the subjects and add the class routine to your school management system."
        >
            <ClassRoutineForm />
        </ContainerLayout>
    )
}