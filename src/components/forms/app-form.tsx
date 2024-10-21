import React, { createContext, PropsWithChildren } from 'react';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type SchemaContextType<T> = ZodType<T>;

const SchemaContext = createContext<SchemaContextType<any> | null>(null);

export type TFormFieldProps<T> = {
    name: keyof T;
    label: string;
    placeholder?: string;
    description?: string;
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

AppForm.Text = function Text<T extends FieldValues>({ name, label, placeholder = '', description = '' }: TFormFieldProps<T>) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder={placeholder} {...field} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

AppForm.Email = function Email<T extends FieldValues>({ name, label, placeholder = '', description = '' }: TFormFieldProps<T>) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder={placeholder} {...field} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

AppForm.Password = function Password<T extends FieldValues>({ name, label, placeholder = '', description = '' }: TFormFieldProps<T>) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name as string}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder={placeholder} {...field} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

interface AppFormSubmitProps extends React.HTMLAttributes<HTMLButtonElement>, PropsWithChildren { }

AppForm.Submit = function Submit({ children, ...props }: AppFormSubmitProps) {
    return (
        <FormItem>
            <FormControl>
                <Button type="submit" {...props}>
                    {children}
                </Button>
            </FormControl>
        </FormItem>
    );
};

export default AppForm;
