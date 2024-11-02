import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { TFormFieldProps } from "./app-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useAppMutation } from "@/hooks/useAppMutation";
import { useFormContext } from "react-hook-form";
import { QueryKey } from "@/react-query/queryKeys";
import { IFileUploadResponse } from "@/types/global.type";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { truncateFilename } from "@/utils/truncate-file-name";
import { LoaderCircle, Trash } from "lucide-react";

interface AppFormFileUploadProps<T> extends TFormFieldProps<T>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
    initialUpload?: IFileUploadResponse['files'],
    maxLimit?: number,
}

export function FileUpload<T>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    containerClassName = '',
    className = '',
    multiple = false,
    initialUpload = [],
    maxLimit = 10,
    ...props
}: AppFormFileUploadProps<T>) {
    const { control, setValue, setError, clearErrors } = useFormContext();
    const [uploaded, setUploaded] = useState<IFileUploadResponse['files']>(initialUpload);

    const { mutateAsync, isPending } = useAppMutation<FormData, IFileUploadResponse>();

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        const formData = new FormData();

        if (files instanceof FileList) {
            if (files.length > maxLimit || uploaded.length > maxLimit) {
                setError(name as string, {
                    type: "manual",
                    message: `You can only upload a maximum of ${maxLimit} files`,
                });
                return;
            }

            clearErrors(name as string);

            for (const file of files) {
                formData.append('files', file);
            }

            const { data } = await mutateAsync({
                data: formData,
                endpoint: QueryKey.FILES,
                method: 'post',
                toastOnSuccess: false,
            });

            if (data && data?.files && !!data?.files.length) {
                setValue(name as string, (
                    multiple ? data.files.map(file => file.id) : data.files[0].id // handling single and multiple uploads
                ));
                setUploaded(prev => [...prev, ...data.files]);
            }
        }
    };

    const handleRemoveFile = (id: string) => {
        setUploaded(prev => {
            const newState = prev.filter(file => file.id !== id);
            setValue(name as string, multiple ? newState.map(file => file.id) : newState[0].id);
            return newState;
        });
    };

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>

                    <label
                        htmlFor={'file_' + (name as string)}
                        role="button"
                        className={cn(
                            "text-sm p-3 py-2 border rounded-md w-full inline-block",
                            (isPending || uploaded.length >= maxLimit) && "!cursor-not-allowed pointer-events-none opacity-90 flex items-center gap-2"
                        )}
                        aria-disabled={isPending}
                    >
                        {
                            isPending
                                ? <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                                : "Click to upload file"
                        }
                    </label>

                    <Input
                        {...field}
                        type="file"
                        id={'file_' + (name as string)}
                        disabled={isPending}
                        placeholder={placeholder}
                        required={required}
                        multiple={multiple}
                        value={undefined} // no need to track the value else throws error since the value will be registered by react-hook-form
                        onChange={handleChange}
                        className={cn("sr-only -left-[100000px]", className)} // negative positioning is to fix overflow scroll issue
                        {...props}
                    />
                    {description && !uploaded.length && <FormDescription>{description}</FormDescription>}

                    {
                        uploaded.length > 0 && (
                            <div>
                                <span className="text-xs text-muted-foreground">Uploaded files:</span>
                                <div className="flex flex-col gap-2">
                                    {
                                        uploaded.map((file) => (
                                            <div className="flex items-center gap-2 justify-between" key={file.id}>
                                                <a href={file.url} key={file.id} className="text-blue-500 hover:underline text-sm break-words w-fit">
                                                    {truncateFilename(file.originalName, 40)}
                                                </a>

                                                <button type="button" onClick={() => handleRemoveFile(file.id)} aria-label="Remove file" title="Remove file">
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }

                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
