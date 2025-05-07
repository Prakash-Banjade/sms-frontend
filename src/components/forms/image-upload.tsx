import { useState, useCallback } from 'react'
import { Trash, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, getErrMsg } from '@/lib/utils'
import { IFileUploadResponse } from '@/types/global.type'
import { QueryKey } from '@/react-query/queryKeys'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAxios } from '@/services/api'

export const IMAGE_QUERY = "w=200&q=80";

interface ImageUploaderProps<T> {
    name: keyof T;
    description?: string;
    onUpload?: (file: File) => Promise<string>
    maxSize?: number // in bytes
    accept?: string;
    containerClassName?: string,
    uploadedImageUrl?: string | null;
    imageQuery?: string;
}

export default function ImageUpload<T>({
    onUpload,
    description = "Select an image or drag here to upload directly",
    maxSize = 5 * 1024 * 1024, // 5MB default
    accept = 'image/*',
    name,
    containerClassName = '',
    uploadedImageUrl = null,
    imageQuery = IMAGE_QUERY,
}: ImageUploaderProps<T>) {
    const axios = useAxios();

    const [isDragging, setIsDragging] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [imageUrl, setImageUrl] = useState<string | null>(uploadedImageUrl ? uploadedImageUrl + '?' + imageQuery : null)
    const [error, setError] = useState<string | null>(null)
    const form = useFormContext();

    const { mutateAsync, isPending } = useMutation<IFileUploadResponse, Error, FormData>({
        mutationFn: async (data) => {
            const response = await axios.post(
                `/${QueryKey.IMAGES}`,
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
            if (data && data?.files && !!data?.files.length) {
                const file = data.files[0];
                setImageUrl(file.url + '?' + imageQuery);
                form.setValue(name as string, file.id);
                setUploadProgress(100);
            } else {
                setUploadProgress(0);
            }
        },
        onError: (error) => {
            setUploadProgress(0);
            setError(getErrMsg(error) || 'Failed to upload file');
        },
    });

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleUpload = useCallback(async (file: File) => {
        try {
            if (file.size > maxSize) {
                throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
            }

            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image')
            }

            setError(null)
            setUploadProgress(0)

            const formData = new FormData();
            formData.append('images', file);

            await mutateAsync(formData);

            setUploadProgress(100)
        } catch (err) {
            if (err instanceof Error) {
                setError(getErrMsg(err) || 'Failed to upload file')
            }
        } finally {
            setIsDragging(false)
        }
    }, [maxSize, onUpload])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) {
            handleUpload(file)
        }
    }, [handleUpload])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleUpload(file)
        }
    }, [handleUpload])

    const handleRemove = useCallback(() => {
        setImageUrl(null); // reset local state value for image
        setUploadProgress(0); // reset progress
        setError(null); // reset error
        form.setValue(name as string, null); // remove from form
    }, [])

    if (isPending) {
        return (
            <div className="p-8 border rounded-lg h-full flex flex-col justify-center">
                <div className="text-center space-y-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <h3 className="font-semibold">Uploading Image: {uploadProgress}%</h3>
                    <p className="text-sm text-muted-foreground">
                        Do not refresh or perform any other action while the image is being uploaded
                    </p>
                </div>
            </div>
        )
    }

    return (
        <section className='h-full relative'>
            <label
                htmlFor={`file-upload-${name as string}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-secondary/20",
                    isDragging ? 'border-primary bg-primary/10' : 'border-border',
                    containerClassName,
                )}
                title={
                    imageUrl ? 'Click to change image' : 'Click to upload image'
                }
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isPending}
                    id={`file-upload-${name as string}`}
                />
                {
                    imageUrl ? (
                        <>
                            <img
                                src={imageUrl}
                                alt="Uploaded preview"
                                className="max-w-80 h-auto rounded object-contain"
                            />
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-gray-400 mb-4" />
                            <h3 className="font-semibold mb-2">Drag an image</h3>
                            <p className="text-sm text-center text-muted-foreground mb-4">
                                {description}
                            </p>
                        </>
                    )
                }
                {
                    error && (
                        <p className="text-destructive">{error}</p>
                    )
                }
            </label>

            {
                imageUrl && (
                    <div className='absolute top-2 right-2'>
                        <Button
                            aria-label='Remove image'
                            title='Remove image'
                            type='button'
                            size={'icon'}
                            onClick={handleRemove}
                            variant="destructive"
                        >
                            <Trash />
                        </Button>
                    </div>
                )
            }
        </section>
    )
}