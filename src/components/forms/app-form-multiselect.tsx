import { FieldValues, useFormContext } from "react-hook-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { TFormFieldProps } from "./app-form";
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
import { Check, ChevronsUpDown, X } from "lucide-react";

interface AppFormSelectProps<T> extends TFormFieldProps<T> {
    options: {
        label: React.ReactNode;
        value: string;
    }[],
    disableOnNoOption?: boolean;
    disabled?: boolean;
    defaultValue?: string[];
}

export function MultiSelect<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    options = [],
    containerClassName = '',
    disableOnNoOption = false,
    defaultValue = [],
}: AppFormSelectProps<T>) {
    const { control, setValue: setFormValue, getValues } = useFormContext();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string[]>(getValues(name as string) ?? defaultValue);

    const isDisabled = disableOnNoOption && !options?.length;

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
                                disabled={isDisabled}
                            >
                                <div className="flex gap-2 justify-start flex-wrap">
                                    {value?.length ?
                                        value.map((val, i) => (
                                            <div role="button"
                                                key={i}
                                                className="px-2 py-0.5 rounded-xl border bg-secondary text-xs font-medium flex gap-1 items-center"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleSetValue(val);
                                                }}
                                            >
                                                <span>
                                                    {options.find((option) => option.value === val)?.label}
                                                </span>
                                                <X className="!size-3" />
                                            </div>
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