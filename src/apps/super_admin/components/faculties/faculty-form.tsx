import AppForm from "@/components/forms/app-form";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { EDegreeLevel } from "@/types/global.type";
import { EDegreeLevelMappings } from "@/utils/labelToValueMappings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

type Props = {
    id: string;
    defaultValues: Partial<z.infer<typeof formSchema>>
} | {
    id?: undefined;
    defaultValues?: undefined
}

const formSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }),
    description: z.string().optional(),
    duration: z.coerce.number().int({ message: 'Duration must be an integer' }).min(1, { message: 'Duration must be greater than 0' }),
    degreeLevel: z.nativeEnum(EDegreeLevel, { message: 'Invalid degree level' }),
});

type FormSchemaType = z.infer<typeof formSchema>

const defaultValues: Partial<z.infer<typeof formSchema>> = {
    name: '',
    description: '',
    degreeLevel: EDegreeLevel.Plus_Two,
    duration: undefined,
}

export default function FacultyForm(props: Props) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: props.defaultValues ?? defaultValues,
    });

    const { mutateAsync } = useAppMutation();

    async function onSubmit(values: FormSchemaType) {
        await mutateAsync({
            endpoint: QueryKey.FACULTIES,
            method: props.id ? 'patch' : 'post',
            id: props.id,
            data: values,
            invalidateTags: [QueryKey.FACULTIES],
        });

        form.reset();
        navigate(`/${payload?.role}/faculties`);
    }

    return (
        <AppForm schema={formSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <section className="grid @xl:grid-cols-2 gap-8 grid-cols-1">
                    <AppForm.Text<FormSchemaType>
                        name="name"
                        label="Name"
                        placeholder={`e.g. Science | BCA | BBA`}
                        description="Enter the name of the academic year."
                        required
                    />

                    <AppForm.Select<FormSchemaType>
                        name="degreeLevel"
                        label="Degree Level"
                        description="Select the degree level."
                        options={
                            Object.entries(EDegreeLevel)
                                .filter(([_, value]) => value !== EDegreeLevel.Basic_School)
                                .map(([_, value]) => ({ label: EDegreeLevelMappings[value], value }))
                        }
                        required
                    />

                    <AppForm.Number<FormSchemaType>
                        name="duration"
                        label="Duration (Month)"
                        placeholder="e.g. 48"
                        description="Enter the duration in month."
                        required
                    />
                </section>

                <AppForm.Textarea<FormSchemaType>
                    containerClassName="grow"
                    name="description"
                    label="Description"
                    description="Describe the room type or leave it blank."
                    placeholder="eg. This room type is for the students who are in the top tier of the school."
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => navigate(`/${payload?.role}/faculties`)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!props.id ? "Save changes" : "Add Faculty"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}