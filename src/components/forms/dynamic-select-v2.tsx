import { FieldValues, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFetchData } from "@/hooks/useFetchData";
import { SelectOption } from "@/types/global.type";
import { TFormFieldProps } from "./app-form";
import { SelectProps } from "@radix-ui/react-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { QueryKey } from "@/react-query/queryKeys";

interface AppFormDynamicSelectProps<T> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    queryKey: QueryKey;
    disableOnNoOption?: boolean;
    clearQueryFilter?: boolean;
}

export function DynamicSelect_V2<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    queryKey,
    containerClassName = '',
    disableOnNoOption = false,
    clearQueryFilter = false, // this is used in filter components to clear the query params, when clicked on clear button
    ...props
}: AppFormDynamicSelectProps<T>) {
    const { control, setValue } = useFormContext();
    const { setSearchParams } = useCustomSearchParams();

    const { data: options, isLoading } = useFetchData<SelectOption[]>({
        queryKey: [queryKey],
        endpoint: queryKey + '/' + QueryKey.OPTIONS,
    });

    const isDisabled = disableOnNoOption && !options?.length;

    const handleOnClear = () => {
        setValue(name as string, '')
        if (clearQueryFilter) setSearchParams(name as string, undefined)
    }

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem className={cn("relative", containerClassName)}>
                    <div>
                        <FormLabel>
                            {label}
                            {(required && !isDisabled) && <span className="text-red-500">*</span>}
                        </FormLabel>
                        {
                            !required && !isDisabled && <span role="button" onClick={() => handleOnClear()} className="text-muted-foreground text-sm absolute right-0 mt-[2px]">
                                Clear
                            </span>
                        }
                    </div>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled || isLoading} {...props} required={(required && !isDisabled)}>
                        <FormControl>
                            <SelectTrigger>
                                {
                                    field.value ? <SelectValue placeholder={placeholder} /> : placeholder
                                }
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                options?.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};