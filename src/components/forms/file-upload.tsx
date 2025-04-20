import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { TFormFieldProps } from "./app-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFormContext } from "react-hook-form";
import { QueryKey } from "@/react-query/queryKeys";
import { IFileUploadResponse } from "@/types/global.type";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { truncateFilename } from "@/utils/truncate-file-name";
import { LoaderCircle, Trash } from "lucide-react";
import { TooltipWrapper } from "../ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/services/api";

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
    const axios = useAxios();
    const [uploadProgress, setUploadProgress] = useState(0)

    const { control, setValue, setError, clearErrors, getValues } = useFormContext();
    const [uploaded, setUploaded] = useState<IFileUploadResponse['files']>(initialUpload);

    const { mutateAsync, isPending } = useMutation<IFileUploadResponse, Error, FormData>({
        mutationFn: async (data) => {
            const response = await axios.post(
                `/${QueryKey.FILES}`,
                data,
                {
                    onUploadProgress(progressEvent) {
                        const progress = progressEvent.total ? Math.round((progressEvent.loaded / progressEvent.total) * 100) : 0;
                        setUploadProgress(progress);
                    },
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log(getValues(name as string))
            if (data && data?.files && !!data?.files.length) {
                setValue(name as string, (
                    multiple ? [...getValues(name as string), ...data.files.map(file => file.id)] : [...getValues(name as string), data.files[0].id] // handling single and multiple uploads
                ));
                setUploaded(prev => [...prev, ...data.files]);
            } else {
                setUploadProgress(0);
            }
        },
        onError: (error) => {
            setUploadProgress(0);
            setError(name as string, {
                type: "manual",
                message: error.message,
            });
        },
    });


    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        const formData = new FormData();

        if (files instanceof FileList) {
            if (files.length > maxLimit || uploaded.length > maxLimit || ((files.length + uploaded.length) > maxLimit)) {
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

            await mutateAsync(formData);
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
                            (isPending || uploaded.length >= maxLimit) && "!cursor-not-allowed pointer-events-none opacity-80 flex items-center gap-2"
                        )}
                        aria-disabled={isPending}
                    >
                        {
                            isPending
                                ? <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Uploading...
                                    <span className="ml-auto">{uploadProgress}%</span>
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
                                <div className="flex flex-col">
                                    {
                                        uploaded.map((file) => (
                                            <div className="flex items-center gap-2 justify-between hover:bg-secondary/50 p-2 rounded-md transition-all" key={file.id}>
                                                <a href={file.url} key={file.id} className="text-blue-500 hover:underline text-sm break-words w-fit">
                                                    {truncateFilename(file.originalName, 40)}
                                                </a>

                                                <TooltipWrapper label="Remove file">
                                                    <button type="button" onClick={() => handleRemoveFile(file.id)} aria-label="Remove file">
                                                        <Trash className="h-4 w-4 text-destructive" />
                                                    </button>
                                                </TooltipWrapper>
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
