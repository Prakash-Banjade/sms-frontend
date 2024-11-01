import ClassRoomForm from '../../components/class-rooms/class-room.form'
import ContainerLayout from '@/components/aside-layout.tsx/container-layout'

export default function AddClassPage() {

    return (
        <ContainerLayout
            title="Add a new class"
            description="Add a new class to your school management system."
        >
            <ClassRoomForm />
        </ContainerLayout>
    )
}