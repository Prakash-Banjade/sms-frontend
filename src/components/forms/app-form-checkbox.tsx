import { FieldValues, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { TFormFieldProps } from "./app-form";
import { cn } from "@/lib/utils";

interface AppFormCheckboxProps<T> extends Omit<TFormFieldProps<T>, "placeholder" | "inputClassName">, Omit<CheckboxProps, 'name'> { }

export function AppCheckbox<T extends FieldValues>({
    name,
    label,
    description = '',
    required = false,
    containerClassName = '',
    ...props
}: AppFormCheckboxProps<T>) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 h-fit", containerClassName)}>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            required={required}
                            {...props}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            {label}
                        </FormLabel>
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}