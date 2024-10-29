import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useGetSubjectChapters } from "../../components/subjects/actions"
import { createQueryString } from "@/utils/create-query-string"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import SubjectChapterForm from "../../components/subjects/subject-chapter-form"
import SubjectChapterCard from "./subject-chapter-card"

type Props = {
    subjectId: string;
}

export default function SubjectChapterList({ subjectId }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data, isLoading } = useGetSubjectChapters({
        queryString: createQueryString({
            subjectId,
        })
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card className="mb-8">
            <CardHeader className="pb-2 flex flex-row justify-between gap-10">
                <CardTitle className="text-xl font-medium">Chapters</CardTitle>

                <ResponsiveDialog
                    isOpen={isAddOpen}
                    setIsOpen={setIsAddOpen}
                    title="Add chapter"
                    className="max-w-[800px]"
                >
                    <SubjectChapterForm setIsOpen={setIsAddOpen} />
                </ResponsiveDialog>

                <Button className="" onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Chapter
                </Button>
            </CardHeader>

            <CardContent className="mt-5">
                {
                    !!data?.data?.length ? data?.data?.map((chapter) => (
                        <SubjectChapterCard key={chapter.id} chapter={chapter} subjectId={subjectId} />
                    )) : <p className="text-sm text-muted-foreground">
                        No chapters
                    </p>
                }
            </CardContent>
        </Card>
    )
}