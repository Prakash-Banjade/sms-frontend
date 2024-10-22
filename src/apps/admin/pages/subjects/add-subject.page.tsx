import AsideLinksLayout from '@/components/aside-layout.tsx/aside-links-layout'
import { academicYearAsideQuickLinks_addNew, academicYearAsideRelatedActions } from '../../components/academic-year/academic-year-aside'
import SubjectForm from '../../components/subjects/subject-form'

export default function AddSubjectPage() {

    return (
        <AsideLinksLayout
            title="Add Subject"
            description="Add a new subject to your school management system."
            quickLinks={academicYearAsideQuickLinks_addNew}
            relatedActions={academicYearAsideRelatedActions}
        >
            <section className='max-w-screen-lg'>
                <SubjectForm />
            </section>

        </AsideLinksLayout>
    )
}