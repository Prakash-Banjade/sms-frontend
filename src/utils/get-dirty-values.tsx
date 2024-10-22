import { FieldValues, UseFormReturn } from "react-hook-form";

export const getDirtyValues = <T extends FieldValues>(values: T, form: UseFormReturn<T>) => {
    const dirtyValues: Partial<T> = {};

    Object.keys(values).forEach((key) => {
        const isFieldDirty = (form.formState.dirtyFields as Record<string, boolean>)[key];
        if (isFieldDirty) {
            dirtyValues[key as keyof T] = values[key as keyof T];
        }
    });

    return dirtyValues;
};
