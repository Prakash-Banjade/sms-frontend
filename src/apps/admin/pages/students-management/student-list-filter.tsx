import AppForm from "@/components/forms/app-form"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {}

const studentSearchFilterSchema = z.object({})

type TStudentSearchFilter = z.infer<typeof studentSearchFilterSchema>

export default function StudentSearchFilters({ }: Props) {
    const form = useForm<TStudentSearchFilter>({
        resolver: zodResolver(studentSearchFilterSchema),
        defaultValues: {}
    })

    return (
        <AppForm<TStudentSearchFilter> form={form} schema={studentSearchFilterSchema}>
            <form onSubmit={form.handleSubmit(() => { })} className="flex gap-8 w-full">
                <SearchInput
                    placeholder="Name | email | phone | roll no"
                    containerClassName="min-w-[300px]"
                />

                <ClassRoomSearchFilterInputs />
            </form>
        </AppForm>
    )
}