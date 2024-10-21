import AsideLinksLayout from '@/components/aside-layout.tsx/aside-links-layout'
import AcademicYearForm from '../../components/academic-year/academic-year-form'
import { academicYearAsideQuickLinks, academicYearAsideRelatedActions } from '../../components/academic-year/academic-year-aside'

export default function AddAcademicYear() {

    return (
        <AsideLinksLayout
            title="Add Academic Year"
            description="Add a new academic year to your school management system."
            quickLinks={academicYearAsideQuickLinks}
            relatedActions={academicYearAsideRelatedActions}
        >
            <section className='max-w-screen-lg'>
                <AcademicYearForm />
            </section>

        </AsideLinksLayout>
    )
}