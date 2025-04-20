import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EllipsisVertical, GripVertical } from "lucide-react"
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
import { TSubjectChapter } from "@/apps/admin/types/subject.type"
import { Badge } from "@/components/ui/badge"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Props = {
    chapter: TSubjectChapter
    subjectId: string;
    forceDragging?: boolean;
}

export default function SubjectChapterCard({ chapter, subjectId, forceDragging }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({
        id: chapter.chapterNo,
    })

    const parentStyles = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? "0.5" : "1",
        lineHeight: "4",
    }

    const draggableStyles = {
        cursor: isDragging || forceDragging ? 'grabbing' : 'grab',
    }

    const { mutateAsync, isPending } = useAppMutation();

    const handleDelete = async (chapterId: string) => {
        await mutateAsync({
            endpoint: QueryKey.SUBJECT_CHAPTERS,
            method: "delete",
            id: chapterId,
            invalidateTags: [QueryKey.SUBJECT_CHAPTERS],
        });
    }

    return (
        <Card className="mb-4" key={chapter.id} ref={setNodeRef} style={parentStyles}>
            <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-md flex items-center">
                    <div
                        ref={setActivatorNodeRef}
                        style={draggableStyles}
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="mr-2 h-5 w-5 text-muted-foreground" />
                    </div>
                    Chapter {chapter.chapterNo}: {chapter.title}
                    <span className="ml-5">
                        <Badge variant="outline" className="text-xs capitalize">
                            {chapter.priority}
                        </Badge>
                    </span>
                </CardTitle>

                {/* dropdown menu */}

                <ResponsiveDialog
                    isOpen={isEditOpen}
                    setIsOpen={setIsEditOpen}
                    title="Edit chapter"
                    className="max-w-[800px]"
                >
                    <SubjectChapterForm setIsOpen={setIsEditOpen} subjectChapterId={chapter.id} defaultValues={{
                        title: chapter.title,
                        content: chapter.content,
                        priority: chapter.priority,
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
                <p className="text-sm text-muted-foreground break-words line-clamp-3">
                    {chapter.content.slice(0, 1000)}
                </p>
            </CardContent>
        </Card>
    )
}