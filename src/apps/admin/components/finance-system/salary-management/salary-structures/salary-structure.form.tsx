import AppForm from "@/components/forms/app-form"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

type Props = {
    salaryStructureId: string;
    defaultValues: salaryStructureType;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const salaryStructure = z.object({
    basicSalary: z.coerce.number().min(0, { message: 'Basic salary is required' }),
    allowances: z.array(z.object({
        amount: z.coerce.number().min(0, { message: 'Amount must be greater than 0' }),
        title: z.string({ required_error: 'Title is required' }).min(1, { message: 'Title is required' })
    })).optional(),
})

const defaultValues: Partial<salaryStructureType> = {
    basicSalary: 0,
    allowances: [],
}

export type salaryStructureType = z.infer<typeof salaryStructure>;

export default function SalaryStructureForm(props: Props) {
    const form = useForm<salaryStructureType>({
        resolver: zodResolver(salaryStructure),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<salaryStructureType, any>();

    async function onSubmit(values: salaryStructureType) {
        const response = await mutateAsync({
            method: "patch",
            endpoint: QueryKey.SALARY_STRUCTURES,
            id: props?.salaryStructureId,
            data: values,
            invalidateTags: [QueryKey.SALARY_STRUCTURES],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen(false);
    }

    return (
        <AppForm schema={salaryStructure} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Number<salaryStructureType>
                    name="basicSalary"
                    label="Basic Salary"
                    placeholder="eg. 55000"
                    description="Basic salary of the teacher"
                    min={1}
                    required
                />

                <EmployeeAllowanceFormFields />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Save chagnes</AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}


export function EmployeeAllowanceFormFields() {
    const form = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'allowances',
    });

    return <section className="space-y-2">
        <Label>Allowances</Label>
        {
            fields.map((field, index) => (
                <section className="flex gap-4 items-end" key={field.id}>
                    <AppForm.Text
                        name={`allowances.${index}.title`}
                        placeholder="Name (eg. Meal)"
                        required
                    />

                    <AppForm.Number
                        name={`allowances.${index}.amount`}
                        placeholder="Amount (eg. 2000)"
                        required
                        min={0}
                    />
                    <Button
                        size={'icon'}
                        variant={'destructive'}
                        type="button"
                        onClick={() => remove(index)}
                        title="Remove"
                    >
                        <Trash />
                    </Button>
                </section>
            ))
        }

        {
            fields.length < 3 && (
                <div className="">
                    <Button
                        variant={'secondary'}
                        type="button"
                        onClick={() => append({ title: '', amount: '' })}
                        title="Click to add new"
                    >
                        <Plus />
                        {
                            fields?.length === 0 ? 'Add allowance' : 'Add another'
                        }
                    </Button>
                </div>
            )
        }
    </section>

}