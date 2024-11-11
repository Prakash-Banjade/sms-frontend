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
import { TClassRoomOptions } from "@/types/class.type";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";


type Props = ({
    options?: undefined;
    isLoading?: undefined;
} | {
    options: TClassRoomOptions; // this is required to control the validation of classroom and section outside of this component
    isLoading: boolean;
}) & {
    noDescription?: boolean;
    containerClassName?: string;
    multipleSections?: boolean;
    required?: boolean;
}

export function ClassSectionFormField({ noDescription = false, containerClassName = '', multipleSections = false, options, required = true }: Props) {
    const form = useFormContext();

    const [selectedClassRoom, setSelectedClassRoom] = useState<TClassRoomOptions[0] | undefined>(); // use to render the section option based on the selected class room
    const [classRoomId, setClassRoomId] = useState<string | undefined>(form.getValues("classRoomId") || ''); // use to store the selected class room id
    const [sectionId, setSectionId] = useState<string | undefined>(form.getValues("sectionId") || ''); // use to store the selected section id
    const [sectionIds, setSectionIds] = useState<string[]>(form.getValues("sectionIds") || []); // use to store the selected section ids


    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
        options: {
            enabled: !Array.isArray(options),
        }
    });

    useEffect(() => { // update selected class room on data change, specially on first render on edit page
        if (data) {
            setSelectedClassRoom(data?.find((classRoom) => classRoom.id === form.getValues("classRoomId")))
        }
    }, [data])

    return (
        <>
            <FormField
                control={form.control}
                name={"classRoomId"}
                render={({ field }) => (
                    <FormItem className={cn("relative", containerClassName)}>
                        <div className="">
                            <FormLabel className="">
                                Class room
                                {required && <span className="text-red-500">*</span>}
                            </FormLabel>
                        </div>
                        <Select
                            value={classRoomId || undefined}
                            onValueChange={val => {
                                setSelectedClassRoom(data?.find((classRoom) => classRoom.id === val))
                                setClassRoomId(val)
                                multipleSections ? setSectionIds([]) : setSectionId('')
                                field.onChange(val)
                                form.setValue("subjectId", ''); // reset subjectId also if present
                                form.setValue("sectionId", ''); // reset subjectId also if present
                                form.setValue("sectionIds", []); // reset sectionIds also if present
                            }}
                            disabled={isLoading}
                            required={required}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        data?.map((classRoom) => (
                                            <SelectItem value={classRoom.id} key={classRoom.id}>{classRoom.name}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {!noDescription && <FormDescription>Select the class room</FormDescription>}
                        <FormMessage />
                    </FormItem>
                )}
            />


            {
                multipleSections
                    ? (
                        <MultiSection
                            values={sectionIds}
                            setValues={setSectionIds}
                            required={!!selectedClassRoom?.children?.length}
                            disabled={
                                !form.getValues('classRoomId')
                                || !selectedClassRoom?.children?.length
                                || isLoading
                            }
                            options={selectedClassRoom?.children?.map((section) => ({ label: section.name, value: section.id })) ?? []}
                            description={noDescription ? undefined : "Select sections"}
                        />
                    )
                    : (
                        <FormField
                            control={form.control}
                            name={"sectionId"}
                            render={({ field }) => (
                                <FormItem className={cn("relative", containerClassName)}>
                                    <div className="">
                                        <FormLabel className="">
                                            Section
                                            {!!selectedClassRoom?.children?.length && required && <span className="text-red-500">*</span>}
                                        </FormLabel>
                                    </div>
                                    <Select
                                        value={sectionId || ''}
                                        onValueChange={val => {
                                            setSectionId(val)
                                            field.onChange(val)
                                        }}
                                        disabled={
                                            !classRoomId
                                            || !selectedClassRoom?.children?.length
                                            || isLoading
                                        }
                                        required={!!selectedClassRoom?.children?.length && required}
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

interface MultiSectionProps {
    required?: boolean;
    disabled?: boolean;
    options: {
        label: React.ReactNode;
        value: string;
    }[],
    description?: string;
    values: string[];
    setValues: React.Dispatch<React.SetStateAction<string[]>>;
}

function MultiSection({ required, disabled, options, description, values, setValues }: MultiSectionProps) {
    const form = useFormContext();
    const [open, setOpen] = useState(false);


    const handleSetValue = (val: string) => {
        if (values.includes(val)) {
            values.splice(values.indexOf(val), 1);

            const updatedValues = values.filter((item) => item !== val);

            setValues(updatedValues);
            form.setValue("sectionIds", updatedValues);
        } else {
            setValues(prevValue => {
                const updatedValues = [...prevValue, val];
                form.setValue("sectionIds", updatedValues);
                return updatedValues;
            });
        }
    }

    return (
        <FormField
            control={form.control}
            name={'sectionIds'}
            render={() => (
                <FormItem>
                    <div>
                        <FormLabel>
                            Sections
                            {required && <span className="text-red-500">*</span>}
                        </FormLabel>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild className="hover:bg-secondary/20">
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between h-max min-h-10"
                                disabled={disabled}
                            >
                                <div className="flex gap-2 justify-start flex-wrap">
                                    {values?.length ?
                                        values.map((val, i) => (
                                            <div key={i} className="px-2 py-0.5 rounded-xl border bg-secondary text-xs font-medium">{options.find((option) => option.value === val)?.label}</div>
                                        ))
                                        : 'Select sections'}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="!min-w-full p-0">
                            <Command>
                                <CommandInput placeholder="Select sections" />
                                <CommandEmpty>No section found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandList>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={() => {
                                                    handleSetValue(option.value);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        values.includes(option.value) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                                {values.length > 0 && (
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => setValues([])}
                                                className="justify-center text-center"
                                            >
                                                Clear Selection
                                            </CommandItem>
                                        </CommandGroup>
                                    </>
                                )}
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}