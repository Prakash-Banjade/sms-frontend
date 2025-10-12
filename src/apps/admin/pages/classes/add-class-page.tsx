import ClassRoomForm from '../../components/class-rooms/class-room.form'
import ContainerLayout from '@/components/page-layouts/container-layout'

export default function AddClassPage() {

    return (
        <ContainerLayout
            title="Adding new class"
            description="Add a new class to your school management system."
        >
            <ClassRoomForm />
        </ContainerLayout>
    )
}