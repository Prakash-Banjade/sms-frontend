import AppForm from "@/components/forms/app-form"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

type Props = {
    noticeId?: undefined;
} | {
    noticeId: string;
    defaultValues: noticeSchemaType;
}

const noticeSchema = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string({ required_error: "Description is required" }).min(100, { message: "Description seems too short. Min 100 characters." }),
})

const defaultValues: Partial<noticeSchemaType> = {
    title: "",
    description: "",
}

export type noticeSchemaType = z.infer<typeof noticeSchema>;

export default function NoticeForm(props: Props) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<noticeSchemaType>({
        resolver: zodResolver(noticeSchema),
        defaultValues: props.noticeId ? props.defaultValues : defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<noticeSchemaType>, any>();

    async function onSubmit(values: noticeSchemaType) {
        const method = !!props.noticeId ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.NOTICES,
            id: props.noticeId,
            data: values,
            invalidateTags: [QueryKey.NOTICES],
        });

        const id = response?.data?.id;

        if (!!id) {
            navigate(`/${payload?.role}/notices/${id}`);
        }
    }

    return (
        <AppForm schema={noticeSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Text<noticeSchemaType>
                    name="title"
                    label="Title"
                    placeholder={`e.g. Dashain Leave`}
                    description="Enter the name of the notice."
                    required
                />

                <FormField
                    control={form.control}
                    name={'description'}
                    render={() => (
                        <FormItem>
                            <FormLabel>
                                Description
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <MinimalTiptapEditor
                                    value={form.getValues("description")}
                                    onChange={(value) => form.setValue("description", value as string)}
                                    className="w-full"
                                    editorContentClassName="p-5"
                                    output="html"
                                    placeholder="Type notice description here..."
                                    editable={true}
                                    editorClassName="focus:outline-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => navigate(`/${payload?.role}/notices`)}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!props.noticeId ? "Save changes" : "Add Notice"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}