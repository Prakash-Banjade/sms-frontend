import AppForm from "@/components/forms/app-form"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

type Props = {}

const classRoutineSearchFilterSchema = z.object({
    classRoomId: z.string().optional(),
    sectionId: z.string().optional(),
})

type TClassRoutineSearchFilter = z.infer<typeof classRoutineSearchFilterSchema>

export default function ClassRoutineSearchFilters({ }: Props) {
    const [searchParams] = useSearchParams();

    const form = useForm<TClassRoutineSearchFilter>({
        resolver: zodResolver(classRoutineSearchFilterSchema),
        defaultValues: {
            classRoomId: searchParams.get("classRoomId") ?? '',
            sectionId: searchParams.get("sectionId") ?? '',
        }
    })

    const onSubmit = () => { }

    return (
        <AppForm<TClassRoutineSearchFilter> form={form} schema={classRoutineSearchFilterSchema}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8 w-full">
                <ClassRoomSearchFilterInputs />
            </form>
        </AppForm>
    )
}