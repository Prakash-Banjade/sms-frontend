import AppForm from "@/components/forms/app-form"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { QueryKey } from "@/react-query/queryKeys"
import { EClassType } from "@/types/global.type"
import { createSearchParams } from "@/utils/create-search-params"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

type Props = {}

const classRoutineSearchFilterSchema = z.object({
    classId: z.string().optional(),
    sectionId: z.string().optional(),
})

type TClassRoutineSearchFilter = z.infer<typeof classRoutineSearchFilterSchema>

export default function ClassRoutineSearchFilters({ }: Props) {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const { setSearchParams } = useCustomSearchParams();

    const form = useForm<TClassRoutineSearchFilter>({
        resolver: zodResolver(classRoutineSearchFilterSchema),
        defaultValues: {
            classId: "",
            sectionId: "",
        }
    })

    useEffect(() => {
        const classId = form.watch("classId")

        if (classId) {
            setSelectedClassId(classId)
            setSearchParams("classRoomId", classId)
        }

    }, [form.watch("classId")])

    useEffect(() => {
        const sectionId = form.watch('sectionId')

        if (sectionId) {
            setSearchParams("classRoomId", sectionId)
        }
    }, [form.watch('sectionId')])

    // useEffect(() => { // TODO: make this workable
    //     form.setValue("sectionId", '')
    // }, [selectedClassId])

    const onSubmit = (value: TClassRoutineSearchFilter) => { }

    return (
        <AppForm<TClassRoutineSearchFilter> form={form} schema={classRoutineSearchFilterSchema}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8 w-full">
                <AppForm.DynamicSelect
                    fetchOptions={{
                        endpoint: QueryKey.CLASSES,
                        queryKey: [QueryKey.CLASSES],
                        queryString: 'page=1&take=50',
                    }}
                    labelKey="name"
                    name="classId"
                    label="Class"
                    placeholder="Select class"
                    containerClassName="min-w-[200px]"
                />

                <AppForm.DynamicSelect
                    fetchOptions={{
                        endpoint: QueryKey.CLASSES,
                        queryKey: [QueryKey.CLASSES, selectedClassId],
                        queryString: createSearchParams({
                            parentClassId: selectedClassId,
                            classType: EClassType.SECTION,
                        }),
                    }}
                    labelKey="name"
                    name="sectionId"
                    label="Section"
                    placeholder="Select section"
                    containerClassName="min-w-[200px]"
                    disableOnNoOption
                />
            </form>
        </AppForm>
    )
}