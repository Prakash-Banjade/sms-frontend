import AppForm from "@/components/forms/app-form"
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod"

type Props = ({
    setIsOpen?: undefined;
} | {
    academicYearId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: academicYearFormSchemaType;
}

const academicYearFormSchema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    startDate: z.string({ required_error: "Start date is required" }).min(10, { message: "Start date is required" }).transform((value) => new Date(value).toISOString()),
    endDate: z.string({ required_error: "End date is required" }).min(10, { message: "End date is required" }).transform((value) => new Date(value).toISOString()),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
})

const defaultValues: Partial<academicYearFormSchemaType> = {
    name: "",
}

export type academicYearFormSchemaType = z.infer<typeof academicYearFormSchema>;

export default function AcademicYearForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.academicYearId) ? props.academicYearId : params.id;

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<academicYearFormSchemaType>({
        resolver: zodResolver(academicYearFormSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<academicYearFormSchemaType>, any>();

    async function onSubmit(values: academicYearFormSchemaType) {
        const method = ((!!props.setIsOpen && props.academicYearId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.ACADEMIC_YEARS,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.ACADEMIC_YEARS],
        });

        console.log(response)
        
        if (response?.data?.message) {
            onDialogClose();
            navigate(`/${payload?.role}/academic-years`);
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen && props.setIsOpen(false);
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
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add Academic Year"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}