import AppForm from "@/components/forms/app-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

type Props = {}

const academicYearFormSchema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    startDate: z.string({ required_error: "Start date is required" }).min(10, { message: "Start date is required" }).transform((value) => new Date(value).toISOString()),
    endDate: z.string({ required_error: "End date is required" }).min(10, { message: "End date is required" }).transform((value) => new Date(value).toISOString()),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
})

type academicYearFormSchemaType = z.infer<typeof academicYearFormSchema>;

export default function AcademicYearForm({ }: Props) {

    const form = useForm<academicYearFormSchemaType>({
        resolver: zodResolver(academicYearFormSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(values: academicYearFormSchemaType) {
        console.log(values)
    }

    return (
        <AppForm schema={academicYearFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Text<academicYearFormSchemaType>
                    name="name"
                    label="Name"
                    placeholder={`e.g. ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                    description="Enter the name of the academic year."
                />
                <section className="flex flex-wrap gap-8">
                    <AppForm.DatePicker<academicYearFormSchemaType>
                        containerClassName="grow"
                        name="startDate"
                        label="Start Date"
                        description="Enter the start date of the academic year."
                    />
                    <AppForm.DatePicker<academicYearFormSchemaType>
                        containerClassName="grow"
                        name="endDate"
                        label="End Date"
                        description="Enter the end date of the academic year."
                    />
                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel>Cancel</AppForm.Cancel>
                    <AppForm.Submit>Add Academic Year</AppForm.Submit>
                </section>


            </form>
        </AppForm>
    )
}