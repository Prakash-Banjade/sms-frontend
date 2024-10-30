import AppForm from "./app-form";
import { useFormContext } from "react-hook-form";
import { useGetClassRoomsOptions } from "@/apps/admin/components/class-rooms/actions";
import { useEffect, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TClassRoomOption, TClassRoomOptions } from "@/types/class.type";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";

type Props = ({
    options?: undefined;
    isLoading?: undefined;
} | {
    options: TClassRoomOptions["data"]; // this is required to control the validation of classroom and section outside of this component
    isLoading: boolean;
}) & {
    noDescription?: boolean;
    containerClassName?: string;
    multipleSections?: boolean;
}

export function ClassSectionFormField({ noDescription = false, containerClassName = '', multipleSections = false, options }: Props) {
    const [selectedClassRoom, setSelectedClassRoom] = useState<TClassRoomOption | undefined>();
    const form = useFormContext();

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
        options: {
            enabled: !Array.isArray(options),
        }
    });

    // Reset form values when classRoomId changes
    useEffect(() => {
        form.setValue("subjectId", undefined)
        if (multipleSections) {
            form.setValue("sectionIds", undefined)
        } else {
            form.setValue("sectionId", undefined)
        }
    }, [form.watch("classRoomId")])

    useEffect(() => { // update selected class room on data change, specially on first render on edit page
        if (data) {
            setSelectedClassRoom(data?.data?.find((classRoom) => classRoom.id === form.getValues("classRoomId")))
        }
    }, [data])

    return (
        <>
            <AppForm.Select
                name="classRoomId"
                label="Class room"
                placeholder="Select class room"
                description={noDescription ? undefined : "Select class room"}
                options={
                    (Array.isArray(options) ? options : data?.data)?.map((classRoom) => ({ label: classRoom.name, value: classRoom.id })) ?? [] // handling the provided options also
                }
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

            {
                multipleSections
                    ? (
                        <AppForm.MultiSelect
                            name="sectionIds"
                            label="Sections"
                            placeholder="Select sections"
                            description={noDescription ? undefined : "Select sections"}
                            options={selectedClassRoom?.children?.map((section) => ({ label: section.name, value: section.id })) ?? []}
                            disabled={
                                !form.getValues('classRoomId')
                                || !selectedClassRoom?.children?.length
                                || isLoading
                            }
                            required={!!selectedClassRoom?.children?.length}
                            containerClassName={containerClassName}
                            disableOnNoOption
                        />
                    )
                    : (
                        <FormField
                            control={form.control}
                            name={"sectionId"}
                            render={() => (
                                <FormItem className={cn("relative", containerClassName)}>
                                    <div className="">
                                        <FormLabel className="">
                                            Section
                                            {!!selectedClassRoom?.children?.length && <span className="text-red-500">*</span>}
                                        </FormLabel>
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
                    )
            }
        </>
    )
}