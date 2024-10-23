import AsideLinksLayout from '@/components/aside-layout.tsx/aside-links-layout'
import { academicYearAsideQuickLinks_addNew, academicYearAsideRelatedActions } from '../../components/academic-year/academic-year-aside'
import ClassRoutineForm from '../../components/class-routine/class-routine.form'

export default function AddClassRoutinePage() {

    return (
        <AsideLinksLayout
            title="Add New Class Routine"
            description="Select a class, assign the subjects and add the class routine to your school management system."
            quickLinks={academicYearAsideQuickLinks_addNew}
            relatedActions={academicYearAsideRelatedActions}
        >
            <section className='max-w-screen-lg'>
                <ClassRoutineForm />
            </section>

        </AsideLinksLayout>
    )
}