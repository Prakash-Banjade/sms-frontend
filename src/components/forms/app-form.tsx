import React, { ButtonHTMLAttributes, createContext, InputHTMLAttributes, PropsWithChildren } from 'react';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import { formatDateNumeric } from '@/utils/format-date';
import { Textarea } from "@/components/ui/textarea"
import { DynamicSelect } from './dynamic-select';
import { AppCheckbox } from './app-form-checkbox';
import { AppFormSelect } from './select';
import { AppFormPhone } from './app-form-phone';
import { AppFormText } from './app-form-text';
import { AppFormEmail } from './app-form-email';
import { DynamicMultiSelect } from './app-form-dynamic-multiselect';
import { MultiSelect } from './app-form-multiselect';
import { DynamicCombobox } from './dynamic-combobox';
import { FileUpload } from './file-upload';
import ImageUpload from './image-upload';
import { DynamicSelect_V2 } from './dynamic-select-v2';
import { NUMBER_REGEX_STRING } from '@/CONSTANTS';

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

export interface AppFormInputProps<T> extends TFormFieldProps<T>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> { }

AppForm.Text = AppFormText;

AppForm.Email = AppFormEmail;

AppForm.Password = function Password<T extends FieldValues>({
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
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input type="password" className={inputClassName} placeholder={placeholder} {...field} required={required} {...props} />
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
                    form.reset(form.formState.defaultValues);
                    action?.();
                }}>
                    {children}
                </Button>
            </FormControl>
        </FormItem>
    );
};


AppForm.DatePicker = function DatePicker<T extends FieldValues>({ name, label, placeholder = '', description = '', required = false, inputClassName = '', containerClassName = '', ...props }: AppFormInputProps<T>) {
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
                            {...props}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

AppForm.TimePicker = function TimePicker<T extends FieldValues>({
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
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input type="time" className={inputClassName} placeholder={placeholder} {...field} required={required} {...props} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

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
                        <Textarea rows={rows} className={inputClassName} placeholder={placeholder} {...field} required={required} value={field.value ?? ''} onChange={field.onChange} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

AppForm.Number = function Number<T extends FieldValues>({
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
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input type="number" pattern={NUMBER_REGEX_STRING} className={inputClassName} placeholder={placeholder} {...field} required={required} {...props} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

AppForm.Phone = AppFormPhone;

AppForm.Checkbox = AppCheckbox;

AppForm.Select = AppFormSelect;

AppForm.DynamicSelect = DynamicSelect;

AppForm.DynamicSelect_V2 = DynamicSelect_V2;

AppForm.FileUpload = FileUpload;

AppForm.ImageUpload = ImageUpload;

AppForm.MultiSelect = MultiSelect;

AppForm.DynamicMultiSelect = DynamicMultiSelect;

AppForm.DynamicCombobox = DynamicCombobox;
export default AppForm;