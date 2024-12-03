import { FieldValues, useFormContext } from "react-hook-form";
import { TFormFieldProps } from "./app-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils";

interface AppFormSelectProps<T> extends TFormFieldProps<T> {
    options: {
        label: React.ReactNode;
        value: string;
    }[],
    direction?: 'row' | 'column',
    disabled?: boolean;
}

export function AppFormRadioGroup<T extends FieldValues>({
    name,
    label,
    description = '',
    required = false,
    options = [],
    containerClassName = '',
    direction = 'row',
    disabled = false
}: AppFormSelectProps<T>) {
    const { control } = useFormContext();

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
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className={cn("flex gap-5", direction === 'column' && "flex-col")}
                            disabled={disabled}
                        >
                            {
                                options.map((option, ind) => (
                                    <FormItem className="flex items-center space-x-3 space-y-0" key={ind}>
                                        <FormControl>
                                            <RadioGroupItem value={option.value} />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {option.label}
                                        </FormLabel>
                                    </FormItem>
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};