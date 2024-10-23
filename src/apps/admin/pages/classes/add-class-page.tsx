import AsideLinksLayout from '@/components/aside-layout.tsx/aside-links-layout'
import { academicYearAsideQuickLinks_addNew, academicYearAsideRelatedActions } from '../../components/academic-year/academic-year-aside'
import ClassRoomForm from '../../components/class-rooms/class-room.form'

export default function AddClassPage() {

    return (
        <AsideLinksLayout
            title="Add Class"
            description="Add a new class to your school management system."
            quickLinks={academicYearAsideQuickLinks_addNew}
            relatedActions={academicYearAsideRelatedActions}
        >
            <section className='max-w-screen-lg'>
                <ClassRoomForm />
            </section>

        </AsideLinksLayout>
    )
}