import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { libraryBookFormDefaultValues, libraryBookSchema, libraryBookSchemaType } from "../../schemas/library-book.schema";
import { useParams } from "react-router-dom";

type Props = ({
    setIsOpen?: undefined;
} | {
    libraryBookId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: Partial<libraryBookSchemaType>;
}

export default function LibraryBookForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.libraryBookId) ? props.libraryBookId : params.id;

    const form = useForm<libraryBookSchemaType>({
        resolver: zodResolver(libraryBookSchema),
        defaultValues: props?.defaultValues ?? libraryBookFormDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<libraryBookSchemaType>, any>();

    async function onSubmit(values: libraryBookSchemaType) {
        const method = ((!!props.setIsOpen && props.libraryBookId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.LIBRARY_BOOKS,
            id,
            data: values,
            invalidateTags: [QueryKey.LIBRARY_BOOKS],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen && props.setIsOpen(false);
    }

    return (
        <AppForm schema={libraryBookSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="@container space-y-8">
                <section className="grid @lg:grid-cols-2 @xl:grid-cols-3 gap-8 grid-cols-1">
                    <AppForm.Text<libraryBookSchemaType>
                        name="bookCode"
                        label="Book code"
                        placeholder="eg. Book-1"
                        description="Enter the book code"
                        required
                    />

                    <AppForm.Text<libraryBookSchemaType>
                        name="bookName"
                        label="Book name"
                        placeholder="eg. Book-1"
                        description="Enter the book name"
                        required
                    />

                    <AppForm.DynamicSelect<libraryBookSchemaType>
                        name="categoryId"
                        label="Category"
                        placeholder="Select category"
                        description="Select the category"
                        fetchOptions={{
                            endpoint: QueryKey.BOOK_CATEGORIES,
                            queryKey: [QueryKey.BOOK_CATEGORIES],
                            queryString: 'skipPagination=true',
                        }}
                        labelKey="name"
                        required
                    />

                    <AppForm.Text<libraryBookSchemaType>
                        name="publisherName"
                        label="Publisher name"
                        placeholder="eg. Publisher-1"
                        description="Enter the publisher name"
                    />

                    <AppForm.Number<libraryBookSchemaType>
                        name="publicationYear"
                        label="Publication year"
                        placeholder={`eg. ${new Date().getFullYear()}`}
                        description="Enter the publication year"
                        min={1}
                        max={new Date().getFullYear()}
                    />

                    <AppForm.Number<libraryBookSchemaType>
                        name="copiesCount"
                        label="Copies count"
                        placeholder={`eg. 10`}
                        description="Enter the copies count"
                        min={1}
                    />
                    <AppForm.Textarea<libraryBookSchemaType>
                        rows={3}
                        name="description"
                        label="Description"
                        placeholder="eg. Any description for the book?"
                        containerClassName="col-span-2"
                    />
                </section>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={onDialogClose}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!id ? "Save changes" : "Add book"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}