import React, { useState } from 'react'
import { useFormContext, FieldValues } from 'react-hook-form'
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { TFormFieldProps } from './app-form'
import { useFetchData } from '@/hooks/useFetchData'
import { ComboboxOption } from '@/types/global.type'
import { QueryKey } from '@/react-query/queryKeys'
import { createQueryString } from '@/utils/create-query-string';

interface AppFormDynamicComboboxProps<T> extends TFormFieldProps<T> {

    emptyPlaceholder?: string;
    disableOnNoOption?: boolean;
    clearQueryFilter?: boolean;
    queryKey: QueryKey;
    disabled?: boolean;
    defaultSelected?: ComboboxOption | null;
}


export function DynamicCombobox<T extends FieldValues>({
    name,
    label,
    queryKey,
    placeholder = "Select option...",
    emptyPlaceholder = "No options found",
    disabled = false,
    description = '',
    required = false,
    containerClassName = '',
    defaultSelected = null
}: AppFormDynamicComboboxProps<T>) {
    const { control } = useFormContext();
    const [selectedValue, setSelectedValue] = useState<ComboboxOption | null>(defaultSelected);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>('');

    const debouncedValue = useDebounce(search, 500);

    const { data: options, isLoading } = useFetchData<ComboboxOption[]>({
        queryKey: [queryKey, debouncedValue],
        endpoint: queryKey + '/' + QueryKey.OPTIONS,
        queryString: createQueryString({
            search: debouncedValue,
        }),
    });

    // // update form value when value changes
    // useEffect(() => {
    //     setFormValue(name as string, search)
    // }, [search])

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field: { onChange } }) => (
                <FormItem className={cn("relative", containerClassName)}>
                    <div>
                        <FormLabel>
                            {label}
                            {(required && !disabled) && <span className="text-red-500">*</span>}
                        </FormLabel>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild className="hover:bg-secondary/20">
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between h-max min-h-10"
                                disabled={disabled || isLoading}
                            >
                                <div className="flex gap-2 justify-start flex-wrap">
                                    {selectedValue?.label ?? placeholder}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="!min-w-full p-0">
                            <Command shouldFilter={false}>
                                <CommandInput placeholder={placeholder} onValueChange={val => setSearch(val)} />
                                <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                                {isLoading && <CommandEmpty>Loading...</CommandEmpty>}
                                <CommandGroup>
                                    <CommandList>
                                        {(options ?? [])?.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={(currentValue) => {
                                                    onChange(currentValue)
                                                    setSelectedValue(currentValue === search ? null : option)
                                                    setOpen(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedValue?.value === option.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}