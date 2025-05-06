import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { libraryBookFormDefaultValues, libraryBookSchema, libraryBookSchemaType } from "../../schemas/library-book.schema";
import { useNavigate, useParams } from "react-router-dom";
import { IFileUploadResponse } from "@/types/global.type";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { useServerErrorInField } from "@/hooks/useServerErrorInField";
import ImageUpload from "@/components/forms/image-upload";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";

type Props = ({
    setIsOpen?: undefined;
} | {
    libraryBookId?: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) & {
    defaultValues?: Partial<libraryBookSchemaType>;
    documents: IFileUploadResponse['files'];
}

export default function LibraryBookForm(props: Props) {
    const params = useParams();
    const id = (!!props.setIsOpen && props.libraryBookId) ? props.libraryBookId : params.id;
    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<libraryBookSchemaType>({
        resolver: zodResolver(libraryBookSchema),
        defaultValues: props?.defaultValues ?? libraryBookFormDefaultValues,
    })

    const { mutateAsync, error } = useAppMutation<Partial<libraryBookSchemaType>, any>();

    async function onSubmit(values: libraryBookSchemaType) {
        const method = ((!!props.setIsOpen && props.libraryBookId) || params.id) ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.LIBRARY_BOOKS,
            id,
            data: {
                ...getDirtyValues(values, form),
                documentIds: values.documentIds,
                coverImageId: values.coverImageId ?? null,
                publicationYear: values.publicationYear ?? libraryBookFormDefaultValues.publicationYear,
                copiesCount: values.copiesCount ?? libraryBookFormDefaultValues.copiesCount,
            },
            invalidateTags: [QueryKey.LIBRARY_BOOKS],
        });

        if (response?.data?.message) {
            onDialogClose();
        }
    }

    const onDialogClose = () => {
        form.reset();
        props.setIsOpen ? props.setIsOpen(false) : navigate(`/${payload?.role}/library/books`);
    }

    // show error directly in form field if send by server
    useServerErrorInField(error, form);

    return (
        <AppForm schema={libraryBookSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="@container">
                <section className="grid @5xl:gap-x-8 gap-y-16 grid-cols-1 @5xl:grid-cols-3">
                    <section className="@5xl:order-2 space-y-2">
                        <Label>Cover image</Label>
                        <ImageUpload<libraryBookSchemaType>
                            name="coverImageId"
                            uploadedImageUrl={form.getValues('coverImageId') ?? null}
                            imageQuery="w=200&q=70"
                            containerClassName="h-full"
                        />
                    </section>

                    <section className="col-span-2 grid @lg:grid-cols-2 @xl:grid-cols-3 gap-8 grid-cols-1">
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

                        <AppForm.FileUpload<libraryBookSchemaType>
                            name="documentIds"
                            label="Digital documents"
                            placeholder="Select documents"
                            description="PDF | MP3 | Max 5 files | 5 MB each"
                            multiple
                            maxLimit={5}
                            initialUpload={props.documents ?? []}
                            accept="application/pdf, audio/mpeg"
                        />

                        <AppForm.Textarea<libraryBookSchemaType>
                            rows={3}
                            name="description"
                            label="Description"
                            placeholder="eg. Any description for the book?"
                            containerClassName="col-span-2"
                        />

                    </section>
                </section>

                <section className="flex gap-4 justify-end mt-16">
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