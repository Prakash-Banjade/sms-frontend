import { FieldValues, useFormContext } from "react-hook-form";
import { TFormFieldProps } from "./app-form";
import { SelectProps } from "@radix-ui/react-select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AppFormSelectProps<T> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    options: {
        label: React.ReactNode;
        value: string;
    }[]
}

export function AppFormSelect<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    options = [],
    containerClassName = '',
    ...props
}: AppFormSelectProps<T>) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem className={containerClassName}>
                    <div className="flex items-center justify-between gap-4">
                        <FormLabel>
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </FormLabel>
                        {
                            !required && <span role="button" onClick={() => field.onChange(undefined)} className="text-sidebar-primary-foreground text-sm">
                                Clear
                            </span>
                        }
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value} {...props}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                options.map((option) => (
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