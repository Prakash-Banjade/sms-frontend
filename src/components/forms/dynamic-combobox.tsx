import React, { useState } from 'react'
import { useFormContext, FieldValues } from 'react-hook-form'
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TFormFieldProps } from './app-form'
import { useFetchData } from '@/hooks/useFetchData'
import { SelectOption } from '@/types/global.type'
import { QueryKey } from '@/react-query/queryKeys'
import { createQueryString } from '@/utils/create-query-string';

interface AppFormDynamicComboboxProps<T> extends TFormFieldProps<T> {
    emptyPlaceholder?: string;
    disableOnNoOption?: boolean;
    clearQueryFilter?: boolean;
    queryKey: QueryKey;
    disabled?: boolean;
    defaultSelected?: SelectOption | SelectOption[] | null;
    onChange?: (value: string) => void;
    queryString?: string;
    multiple?: boolean
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
    defaultSelected = null,
    onChange: onChangeProp,
    queryString,
    multiple = false,
}: AppFormDynamicComboboxProps<T>) {
    const { control } = useFormContext();
    const [selectedValues, setSelectedValues] = useState<SelectOption[] | null>(
        Array.isArray(defaultSelected)
            ? defaultSelected // array value
            : !!defaultSelected
                ? [defaultSelected] // single value provided, convert it to array
                : null // no default value
    );

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>('');

    const debouncedValue = useDebounce(search, 500);

    const { data: options, isLoading } = useFetchData<SelectOption[]>({
        queryKey: [queryKey, debouncedValue],
        endpoint: queryKey + '/' + QueryKey.OPTIONS,
        queryString: createQueryString({
            search: debouncedValue,
        }) + (!!queryString ? `&${queryString}` : ''),
    });

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
                                className="w-full justify-between h-max min-h-10 overflow-hidden disabled:!cursor-not-allowed disabled:pointer-events-auto"
                                disabled={disabled || isLoading}
                            >
                                {
                                    selectedValues?.length
                                        ? formatArray(selectedValues.map(item => item.label), 2)
                                        : placeholder
                                }
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
                                        {(options ?? [])?.map((option) => {
                                            const newValueArray = selectedValues?.some(item => item.value === option.value)
                                                ? selectedValues?.filter(item => item.value !== option.value)
                                                : [...(selectedValues ?? []), option]

                                            return (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.value}
                                                    onSelect={(currentValue) => {
                                                        onChange(
                                                            multiple
                                                                ? newValueArray.map(item => item.value)
                                                                : currentValue
                                                        )
                                                        setSelectedValues(multiple ? newValueArray : [option])
                                                        onChangeProp?.(currentValue)
                                                        !multiple && setOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedValues?.some(item => item.value === option.value) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {option.label}
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandList>
                                </CommandGroup>
                                {!!selectedValues?.length && !required && (
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setSelectedValues([])
                                                    onChange('')
                                                    setSearch('')
                                                    setOpen(false)
                                                }}
                                                className="justify-center text-center"
                                            >
                                                Reset
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
}

function formatArray(arr: string[], maxSize = 3): string {
    const n = arr.length;

    if (n <= maxSize) {
        return arr.join(', ');
    } else {
        const firstThree = arr.slice(0, maxSize).join(', ');
        const moreCount = n - maxSize;
        return `${firstThree} and +${moreCount} more`;
    }
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