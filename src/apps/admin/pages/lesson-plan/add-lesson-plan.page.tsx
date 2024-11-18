import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
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