import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save } from "lucide-react"
import { useGetSubjectChapters } from "../../components/subjects/data-access"
import { createQueryString } from "@/utils/create-query-string"
import { useEffect, useState } from "react"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import SubjectChapterForm from "../../components/subjects/subject-chapter-form"
import SubjectChapterCard from "./subject-chapter-card"
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TSubjectChapter } from "@/types/subject.type"
import _ from "lodash"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import LoadingButton from "@/components/forms/loading-button"

type Props = {
    subjectId: string;
}

export default function SubjectChapterList({ subjectId }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [items, setItems] = useState<TSubjectChapter[]>([]); // used to track the chapters list that may change due to drag and drop

    const { data, isLoading } = useGetSubjectChapters({
        queryString: createQueryString({
            subjectId,
        })
    })

    const { mutateAsync, isPending } = useAppMutation();

    useEffect(() => { // setting the chapters to items
        setItems(data?.data ?? []);
    }, [data])

    async function saveChapterNo() {
        if (!data?.data) return;
        const updatedChapters = _.differenceWith(items, data?.data, _.isEqual)

        if (updatedChapters.length === 0) return;

        await mutateAsync({
            endpoint: QueryKey.SUBJECT_CHAPTERS + '/update-chapter-no',
            method: 'patch',
            data: {
                chapters: updatedChapters.map(item => ({
                    id: item.id,
                    chapterNo: item.chapterNo
                }))
            },
            invalidateTags: [QueryKey.SUBJECT_CHAPTERS]
        })
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
                    <SubjectChapterForm setIsOpen={setIsAddOpen} />
                </ResponsiveDialog>

                <section className="space-x-2">
                    {
                        !!_.differenceWith(items, (data?.data ?? []), _.isEqual)?.length && (
                            <>
                                <Button variant={'outline'} onClick={() => setItems(data?.data ?? [])}>
                                    Cancel
                                </Button>
                                <LoadingButton isLoading={isPending} variant={'secondary'} onClick={saveChapterNo} loadingText="Saving...">
                                    <Save />
                                    Save
                                </LoadingButton>
                            </>
                        )
                    }

                    <Button className="" onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add Chapter
                    </Button>
                </section>
            </CardHeader>

            <CardContent className="mt-5">
                {
                    !!data?.data?.length
                        ? <ChaptersList items={items} setItems={setItems} subjectId={subjectId} />
                        : <p className="text-sm text-muted-foreground">
                            No chapters
                        </p>
                }
            </CardContent>
        </Card>
    )
}

function ChaptersList({
    items,
    setItems,
    subjectId
}: {
    items: TSubjectChapter[],
    setItems: React.Dispatch<React.SetStateAction<TSubjectChapter[]>>,
    subjectId: string
}) {
    const [activeItem, setActiveItem] = useState<TSubjectChapter | undefined>(undefined);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActiveItem(items?.find((ch) => ch.chapterNo === active.id));
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeItem = items.find((ch) => ch.chapterNo === active.id);
        const overItem = items.find((ch) => ch.chapterNo === over.id);

        if (!activeItem || !overItem) return;

        const activeIndex = items.findIndex(ch => ch.chapterNo === active.id);
        const overIndex = items.findIndex(ch => ch.chapterNo === over.id);

        if (activeIndex !== overIndex) {
            setItems(prev => {
                const updated = arrayMove(prev, activeIndex, overIndex).map((ch, i) => ({
                    ...ch,
                    chapterNo: i + 1,
                }))
                return updated;
            })
        }

        setActiveItem(undefined);
    }

    function handleDragCancel() {
        setActiveItem(undefined);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={items.map(ch => ch.chapterNo)}
                strategy={verticalListSortingStrategy}
            >
                {
                    items.map((ch) => (
                        <SubjectChapterCard key={ch.id} chapter={ch} subjectId={subjectId} />
                    ))
                }
            </SortableContext>

            <DragOverlay
                adjustScale
                style={{
                    transformOrigin: "0 0"
                }}
            >
                {
                    activeItem ? (
                        <SubjectChapterCard chapter={activeItem} subjectId={subjectId} forceDragging />
                    ) : null
                }
            </DragOverlay>
        </DndContext>
    )
}