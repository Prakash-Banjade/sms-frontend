import AppForm from "./app-form";
import { useFormContext } from "react-hook-form";
import { useGetClassRoomsOptions } from "@/apps/admin/components/class-rooms/actions";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TClassRoomOption } from "@/types/class.type";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";

type Props = {
    noDescription?: boolean;
    containerClassName?: string;
}

export function ClassSectionFormField({ noDescription = false, containerClassName = '' }: Props) {
    const [selectedClassRoom, setSelectedClassRoom] = useState<TClassRoomOption | undefined>();
    const form = useFormContext();

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
    });

    // Reset form values when classRoomId changes
    useEffect(() => {
        form.setValue("subjectId", undefined)
        form.setValue("sectionId", undefined)
    }, [form.watch("classRoomId")])

    return (
        <>
            <AppForm.Select
                name="classRoomId"
                label="Class room"
                placeholder="Select class room"
                description={noDescription ? undefined : "Select class room"}
                options={data?.data?.map((classRoom) => ({ label: classRoom.name, value: classRoom.id })) ?? []}
                disabled={isLoading}
                required
                containerClassName={containerClassName}
                value={form.getValues("classRoomId") ?? ''}
                onValueChange={val => {
                    setSelectedClassRoom(data?.data?.find((classRoom) => classRoom.id === val))
                    form.setValue("classRoomId", val)
                    form.setValue("sectionId", undefined)
                    form.setValue("subjectId", undefined)
                }}
            />

            <FormField
                control={form.control}
                name={"sectionId"}
                render={({ field }) => (
                    <FormItem className={cn("relative", containerClassName)}>
                        <div className="">
                            <FormLabel className="">
                                Section
                                {!!selectedClassRoom?.children?.length && <span className="text-red-500">*</span>}
                            </FormLabel>
                            {/* {
                                !selectedClassRoom?.children?.length && <span role="button" onClick={() => field.onChange(undefined)} className="text-muted-foreground text-sm absolute right-0 mt-[2px]">
                                    Clear
                                </span>
                            } */}
                        </div>
                        <Select
                            value={form.getValues("sectionId") ?? ''}
                            onValueChange={val => form.setValue("sectionId", val)}
                            disabled={
                                !form.getValues('classRoomId')
                                || !selectedClassRoom?.children?.length
                                || isLoading
                            }
                            required={!!selectedClassRoom?.children?.length}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        selectedClassRoom?.children?.map((section) => (
                                            <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {!noDescription && <FormDescription>Select the section</FormDescription>}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}