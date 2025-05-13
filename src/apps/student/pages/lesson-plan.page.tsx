import { useGetSubjectOptions } from "@/apps/admin/components/subjects/data-access";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SingleLessonPlanView from "../components/lesson-plan/single-lesson-plan-view";


export default function LessonPlanPage() {
    return (
        <ContainerLayout
            title="Lesson Plans"
            description="All subjects lesson plans by teachers"
        >

            <SubjectsTabs />

        </ContainerLayout>
    )
}

function SubjectsTabs() {
    const { data, isLoading } = useGetSubjectOptions({});

    if (isLoading) return <div>Loading...</div>;

    if (!data) return null;

    return (
        <Tabs defaultValue={data[0].id}>
            <TabsList>
                {data.map(subject => (
                    <TabsTrigger key={subject.id} value={subject.id}>{subject.subjectName}</TabsTrigger>
                ))}
            </TabsList>
            <section className="mt-6">
                {
                    data.map(subject => (
                        <TabsContent key={subject.id} value={subject.id}>
                            <SingleLessonPlanView id={subject.id} />
                        </TabsContent>
                    ))
                }
            </section>
        </Tabs>
    )
}