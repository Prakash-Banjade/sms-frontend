import { FieldValues, useFormContext } from "react-hook-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFetchData, UseFetchDataOptions } from "@/hooks/useFetchData";
import { PaginatedResponse } from "@/types/global.type";
import { TFormFieldProps } from "./app-form";
import { SelectProps } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
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

interface Option {
    label: string;
    value: string;
}

interface AppFormDynamicSelectProps<T, F> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    fetchOptions: UseFetchDataOptions<PaginatedResponse<F>>
    disableOnNoOption?: boolean;
    labelKey: string;
    clearQueryFilter?: boolean;
}

export function DynamicMultiSelect<T extends FieldValues, F = any>({
    name,
    label,
    placeholder = 'Select Option...',
    description = '',
    required = false,
    containerClassName = '',
    fetchOptions,
    labelKey,
    disableOnNoOption = false,
    // clearQueryFilter = false, // this is used in filter components to clear the query params, when clicked on clear button
}: AppFormDynamicSelectProps<T, F>) {
    const { control, setValue: setFormValue, getValues } = useFormContext();
    const [options, setOptions] = useState<Option[]>([]); // this is use to render the options

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string[]>(getValues(name as string) ?? []);

    const { data, isLoading } = useFetchData<PaginatedResponse<F>>(fetchOptions);

    useEffect(() => {
        if (data) {
            Array.isArray(data) // data can be array or object based on if pagination is applied from backend
                ? setOptions(data.map((option) => ({ label: option[labelKey], value: option.id })))
                : setOptions(data?.data?.map((option) => ({ label: option[labelKey], value: option.id })) ?? [])
        }
    }, [data])

    const isDisabled = disableOnNoOption && (Array.isArray(data) ? !data?.length : !data?.data?.length);

    const handleSetValue = (val: string) => {
        if (value.includes(val)) {
            value.splice(value.indexOf(val), 1);
            setValue(value.filter((item) => item !== val));
        } else {
            setValue(prevValue => [...prevValue, val]);
        }
    }

    // update form value when value changes
    useEffect(() => {
        setFormValue(name as string, value)
    }, [value])

    return (
        <FormField
            control={control}
            name={name as string}
            render={() => (
                <FormItem className={cn("relative", containerClassName)}>
                    <div>
                        <FormLabel>
                            {label}
                            {(required && !isDisabled) && <span className="text-red-500">*</span>}
                        </FormLabel>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild className="hover:bg-secondary/20">
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between h-max min-h-10"
                                disabled={isDisabled || isLoading}
                            >
                                <div className="flex gap-2 justify-start flex-wrap">
                                    {value?.length ?
                                        value.map((val, i) => (
                                            <div key={i} className="px-2 py-0.5 rounded-xl border bg-secondary text-xs font-medium">{options.find((option) => option.value === val)?.label}</div>
                                        ))
                                        : placeholder}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="!min-w-full p-0">
                            <Command>
                                <CommandInput placeholder={placeholder} />
                                <CommandEmpty>No option found.</CommandEmpty>
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
                                                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                                {value.length > 0 && ( 
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => setValue([])}
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
    );
};