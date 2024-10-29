import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EllipsisVertical, GripVertical, Plus } from "lucide-react"
import { useGetSubjectChapters } from "../../components/subjects/actions"
import { createQueryString } from "@/utils/create-query-string"
import { useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import SubjectChapterForm from "../../components/subjects/subject-chapter-form"
import {
    DropdownMenu,
    DropdownMenuButtonItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"

type Props = {
    subjectId: string;
}

export default function SubjectChapterList({ subjectId }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { mutateAsync, isPending } = useAppMutation();

    const { data, isLoading } = useGetSubjectChapters({
        queryString: createQueryString({
            subjectId,
        })
    })

    const handleDelete = async (chapterId: string) => {
        const response = await mutateAsync({
            endpoint: QueryKey.SUBJECT_CHAPTERS,
            method: "delete",
            id: chapterId,
            invalidateTags: [QueryKey.SUBJECT_CHAPTERS],
        });

        console.log(response)
    }

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
                    <SubjectChapterForm />
                </ResponsiveDialog>

                <Button className="" onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Chapter
                </Button>
            </CardHeader>

            <CardContent className="mt-5">
                {
                    data?.data?.map((chapter) => (
                        <Card className="mb-4" key={chapter.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-md flex items-center">
                                    <span>
                                        <GripVertical className="mr-2 h-5 w-5 text-muted-foreground" />
                                    </span>
                                    Chapter {chapter.chapterNo}: {chapter.title}
                                </CardTitle>

                                {/* dropdown menu */}

                                <ResponsiveDialog
                                    isOpen={isEditOpen}
                                    setIsOpen={setIsEditOpen}
                                    title="Edit chapter"
                                    className="max-w-[800px]"
                                >
                                    <SubjectChapterForm subjectChapterId={chapter.id} defaultValues={{
                                        ...chapter,
                                        subjectId,
                                    }} />
                                </ResponsiveDialog>

                                <ResponsiveAlertDialog
                                    isOpen={isDeleteOpen}
                                    setIsOpen={setIsDeleteOpen}
                                    title="Delete Class Routine"
                                    description="Are you sure you want to delete this class routine?"
                                    action={() => handleDelete(chapter.id)}
                                    actionLabel="Yes, Delete"
                                    isLoading={isPending}
                                />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                                            <span>Edit</span>
                                        </DropdownMenuButtonItem>
                                        <DropdownMenuButtonItem className="text-destructive" onClick={() => setIsDeleteOpen(true)}>
                                            <span>Delete</span>
                                        </DropdownMenuButtonItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {chapter.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                }

                {
                    data?.data?.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No chapters
                        </p>
                    )
                }
            </CardContent>
        </Card>
    )
}