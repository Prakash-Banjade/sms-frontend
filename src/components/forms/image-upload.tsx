import { ChangeEvent, InputHTMLAttributes } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { TFormFieldProps } from "./app-form";
import { useAppMutation } from "@/hooks/useAppMutation";
import { IFileUploadResponse } from "@/types/global.type";
import { QueryKey } from "@/react-query/queryKeys";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from "../ui/input";

interface AppFormImageUploadProps<T> extends TFormFieldProps<T>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> { }

export function ImageUpload<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    inputClassName = '',
    containerClassName = '',
    ...props
}: AppFormImageUploadProps<T>) {
    const { control, setValue } = useFormContext();

    const { mutateAsync, isPending } = useAppMutation<FormData, IFileUploadResponse>();

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('images', file);

            const { data } = await mutateAsync({
                data: formData,
                endpoint: QueryKey.IMAGES,
                method: 'post',
                toastOnSuccess: false,
            });

            if (data && data?.files && !!data?.files.length) {
                setValue(name as string, data.files[0].url);
            }
        }
    }

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
                        <Input
                            {...field}
                            type="file"
                            disabled={isPending}
                            className={inputClassName}
                            placeholder={placeholder}
                            required={required}
                            onChange={handleChange}
                            {...props}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};