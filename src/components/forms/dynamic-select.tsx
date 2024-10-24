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

interface AppFormDynamicSelectProps<T, F> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    fetchOptions: UseFetchDataOptions<PaginatedResponse<F>>
    // labelKey: keyof PaginatedResponse<F>['data'][0]
    disableOnNoOption?: boolean;
    labelKey: string;
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
    ...props
}: AppFormDynamicSelectProps<T, F>) {
    const { control } = useFormContext();

    const { data, isLoading } = useFetchData<PaginatedResponse<F>>(fetchOptions);

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem className={containerClassName}>
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={(disableOnNoOption && !data?.data?.length) || isLoading} {...props}>
                        <FormControl>
                            <SelectTrigger>
                                {
                                    field.value ? <SelectValue placeholder={placeholder} /> : placeholder
                                }
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                data?.data?.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option[labelKey]}
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