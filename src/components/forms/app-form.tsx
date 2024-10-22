import React, { ButtonHTMLAttributes, ChangeEvent, createContext, InputHTMLAttributes, PropsWithChildren } from 'react';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import { formatDateNumeric } from '@/utils/format-date';
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectProps } from '@radix-ui/react-select';
import { useFetchData, UseFetchDataOptions } from '@/hooks/useFetchData';
import { IFileUploadResponse, PaginatedResponse } from '@/types/global.type';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';

type SchemaContextType<T> = ZodType<T>;

const SchemaContext = createContext<SchemaContextType<any> | null>(null);

export type TFormFieldProps<T> = {
    name: keyof T;
    label: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    inputClassName?: string;
    containerClassName?: string;
};

interface FormProps<T extends FieldValues> {
    schema: ZodType<T>;
    children: React.ReactNode;
    form: UseFormReturn<T>;
}

function AppForm<T extends FieldValues>({ schema, children, form }: FormProps<T>) {
    return (
        <SchemaContext.Provider value={schema}>
            <Form {...form}>{children}</Form>
        </SchemaContext.Provider>
    );
}

AppForm.Text = function Text<T extends FieldValues>({ name, label, placeholder = '', description = '', required = false, inputClassName = '', containerClassName = '' }: TFormFieldProps<T>) {
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
                        <Input type="text" className={inputClassName} placeholder={placeholder} {...field} required={required} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

AppForm.Email = function Email<T extends FieldValues>({ name, label, placeholder = '', description = '', required = false, inputClassName = '', containerClassName = '' }: TFormFieldProps<T>) {
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
                        <Input type="email" className={inputClassName} placeholder={placeholder} {...field} required={required} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

AppForm.Password = function Password<T extends FieldValues>({ name, label, placeholder = '', description = '', required = false, inputClassName = '', containerClassName = '' }: TFormFieldProps<T>) {
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
                        <Input type="password" className={inputClassName} placeholder={placeholder} {...field} required={required} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

interface AppFormActionProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
    action?: () => void;
}

AppForm.Submit = function Submit({ children, action, disabled, ...props }: AppFormActionProps) {
    const form = useFormContext();

    // we can pass disabled prop from outside and it will also be disabled when form is submitting
    const isDisabled = form.formState.isSubmitting || form.formState.isLoading || disabled;

    return (
        <FormItem>
            <FormControl>
                <Button type="submit" {...props} disabled={isDisabled} onClick={() => action?.()}>
                    {
                        form.formState.isSubmitting
                            ? <LoaderCircle className="h-4 w-4 animate-spin" />
                            : children
                    }
                </Button>
            </FormControl>
        </FormItem>
    );
};

AppForm.Cancel = function Cancel({ children, action, ...props }: AppFormActionProps) {
    const form = useFormContext();

    const disabled = form.formState.isSubmitting || form.formState.isLoading;

    return (
        <FormItem>
            <FormControl>
                <Button variant={'outline'} type="reset" {...props} disabled={disabled} onClick={() => {
                    form.reset();
                    action?.();
                }}>
                    {children}
                </Button>
            </FormControl>
        </FormItem>
    );
};



AppForm.DatePicker = function DatePicker<T extends FieldValues>({ name, label, placeholder = '', description = '', required = false, inputClassName = '', containerClassName = '' }: TFormFieldProps<T>) {
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
                        <Input
                            type="date"
                            className={inputClassName}
                            placeholder={placeholder}
                            {...field}
                            value={!!field.value ? formatDateNumeric({ date: new Date(field.value) }) : ''}
                            required={required}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

AppForm.Textarea = function AppFormTextarea<T extends FieldValues>({ name, label, placeholder = '', description = '', required = false, inputClassName = '', containerClassName = '', rows = 2 }: TFormFieldProps<T> & { rows?: number }) {
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
                        <Textarea rows={rows} className={inputClassName} placeholder={placeholder} {...field} required={required} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

interface AppformNumberProps<T> extends TFormFieldProps<T>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> { }

AppForm.Number = function Number<T extends FieldValues>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    inputClassName = '',
    containerClassName = '',
    ...props
}: AppformNumberProps<T>) {
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
                        <Input type="number" pattern='^[0-9]*$' className={inputClassName} placeholder={placeholder} {...field} required={required} {...props} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

interface AppFormSelectProps<T> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    options: {
        label: React.ReactNode;
        value: string;
    }[]
}

AppForm.Select = function AppFormSelect<T extends FieldValues>({
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
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
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


// DYNAMIC SELECT FIELD --------------------------->

interface AppFormDynamicSelectProps<T, F> extends TFormFieldProps<T>, Omit<SelectProps, 'name'> {
    fetchOptions: UseFetchDataOptions<PaginatedResponse<F>>
    // labelKey: keyof PaginatedResponse<F>['data'][0]
    labelKey: string;
}

AppForm.DynamicSelect = function DynamicSelect<T extends FieldValues, F>({
    name,
    label,
    placeholder = '',
    description = '',
    required = false,
    containerClassName = '',
    fetchOptions,
    labelKey,
    ...props
}: AppFormDynamicSelectProps<T, F>) {
    const { control } = useFormContext();

    const { data } = useFetchData<PaginatedResponse<F>>(fetchOptions);

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
                    <Select onValueChange={field.onChange} defaultValue={field.value} {...props}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
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

// Image Upload --------------------------->

interface AppFormImageUploadProps<T> extends TFormFieldProps<T>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> { }

AppForm.ImageUpload = function ImageUpload<T extends FieldValues>({
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

export default AppForm;
