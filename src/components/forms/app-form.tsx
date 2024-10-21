import React, { createContext, PropsWithChildren } from 'react';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import { formatDate, formatDateNumeric } from '@/utils/format-date';

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
                        <Input type="text" className={inputClassName} placeholder={placeholder} {...field} />
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
                        <Input type="email" className={inputClassName} placeholder={placeholder} {...field} />
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
                        <Input type="password" className={inputClassName} placeholder={placeholder} {...field} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

interface AppFormActionProps extends React.HTMLAttributes<HTMLButtonElement>, PropsWithChildren { }

AppForm.Submit = function Submit({ children, ...props }: AppFormActionProps) {
    const form = useFormContext();

    const disabled = form.formState.isSubmitting || form.formState.isLoading;

    return (
        <FormItem>
            <FormControl>
                <Button type="submit" {...props} disabled={disabled}>
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

AppForm.Cancel = function Cancel({ children, ...props }: AppFormActionProps) {
    const form = useFormContext();

    const disabled = form.formState.isSubmitting || form.formState.isLoading;

    return (
        <FormItem>
            <FormControl>
                <Button variant={'outline'} type="reset" {...props} disabled={disabled}>
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
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default AppForm;
