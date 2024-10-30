import { FieldValues, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFetchData, UseFetchDataOptions } from "@/hooks/useFetchData";
import { PaginatedResponse } from "@/types/global.type";
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

interface AppFormDynamicSelectProps<T, F> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    fetchOptions: UseFetchDataOptions<PaginatedResponse<F>>
    disableOnNoOption?: boolean;
    labelKey: string;
    clearQueryFilter?: boolean;
}

export function DynamicSelect<T extends FieldValues, F = any>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    containerClassName = '',
    fetchOptions,
    labelKey,
    disableOnNoOption = false,
    clearQueryFilter = false, // this is used in filter components to clear the query params, when clicked on clear button
    ...props
}: AppFormDynamicSelectProps<T, F>) {
    const { control, setValue } = useFormContext();
    const { setSearchParams } = useCustomSearchParams();

    const { data, isLoading } = useFetchData<PaginatedResponse<F>>(fetchOptions);

    const isDisabled = disableOnNoOption && !data?.data?.length;

    const handleOnClear = () => {
        setValue(name as string, undefined)
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
                                Array.isArray(data) ? ( // data can be array or object based on if pagination is applied from backend
                                    data?.map((option) => (
                                        <SelectItem key={option.id} value={option.id}>
                                            {option[labelKey]}
                                        </SelectItem>
                                    ))
                                ) : (
                                    data?.data?.map((option) => (
                                        <SelectItem key={option.id} value={option.id}>
                                            {option[labelKey]}
                                        </SelectItem>
                                    ))
                                )
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