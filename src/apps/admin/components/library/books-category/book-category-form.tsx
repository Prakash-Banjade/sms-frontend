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
    bookCategoryId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: bookCategoryFormSchemaType;
}

const bookCategoryFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
})

const defaultValues: Partial<bookCategoryFormSchemaType> = {
    name: "",
}

export type bookCategoryFormSchemaType = z.infer<typeof bookCategoryFormSchema>;

export default function BookCategoryForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.bookCategoryId) ? props.bookCategoryId : params.id;

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<bookCategoryFormSchemaType>({
        resolver: zodResolver(bookCategoryFormSchema),
        defaultValues: props?.defaultValues ?? defaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<bookCategoryFormSchemaType>, any>();

    async function onSubmit(values: bookCategoryFormSchemaType) {
        const method = ((!!props.setIsOpen && props.bookCategoryId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.BOOK_CATEGORIES,
            id,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.BOOK_CATEGORIES],
            toastOnSuccess: false,
        });

        if (response?.data?.message) {
            onDialogClose();
            navigate(`/${payload?.role}/library/books/categories`);
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={bookCategoryFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AppForm.Text<bookCategoryFormSchemaType>
                    name="name"
                    label="Category Name"
                    placeholder={`e.g. Science`}
                    description="Enter the category name"
                    required
                />

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add category"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}