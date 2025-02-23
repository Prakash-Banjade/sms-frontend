import ContainerLayout from '@/components/page-layouts/container-layout'
import LessonPlanForm from '../../components/lesson-plan/lesson-plan-form'

export default function AddLessonPlanPage() {
    return (
        <ContainerLayout
            title='Add Lesson Plan'
            description='Add a new lesson plan'
        >
            <LessonPlanForm />
        </ContainerLayout>
    )
}