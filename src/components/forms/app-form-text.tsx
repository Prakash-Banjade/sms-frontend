import { FieldValues, useFormContext } from "react-hook-form";
import { AppFormInputProps } from "./app-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export function AppFormText<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    inputClassName = '',
    containerClassName = '',
    ...props
}: AppFormInputProps<T>) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem className={containerClassName}>
                    {
                        !!label && <FormLabel>
                            {label}
                            {required && <span className="text-red-500">*</span>}
                        </FormLabel>
                    }
                    <FormControl>
                        <Input type="text" className={inputClassName} placeholder={placeholder} {...field} required={required} {...props} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};