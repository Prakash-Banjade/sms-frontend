import AppForm from '@/components/forms/app-form'
import { Button } from '@/components/ui/button'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import { TooltipWrapper } from '@/components/ui/tooltip'
import { useAppMutation } from '@/hooks/useAppMutation'
import { QueryKey } from '@/react-query/queryKeys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
    credentialId: string,
    defaultName: string,
}

const editPasskeySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});

type editPasskeySchemaType = z.infer<typeof editPasskeySchema>;

export default function EditPassKeyBtn({ credentialId, defaultName }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<editPasskeySchemaType>({
        resolver: zodResolver(editPasskeySchema),
        defaultValues: {
            name: defaultName,
        }
    });

    const { mutateAsync, error } = useAppMutation();

    async function onSubmit(values: editPasskeySchemaType) {
        await mutateAsync({
            endpoint: QueryKey.WEB_AUTHN,
            id: credentialId,
            method: 'patch',
            data: values,
            toastOnError: false,
            invalidateTags: [QueryKey.WEB_AUTHN],
        })

        setIsOpen(false);
    }

    useEffect(() => { // show error directly in form field if send by server
        const errObj = (error as any)?.response?.data?.message;
        if (!!errObj?.field) {
            form.setError(errObj.field, { message: errObj?.message });
            form.setFocus(errObj.field);
        }
    }, [error])

    return (
        <div>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Edit Passkey Nickname"
            >
                <AppForm schema={editPasskeySchema} form={form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AppForm.Text<editPasskeySchemaType>
                            name='name'
                            placeholder='eg. Right Thumb'
                            label='Passkey Nickname'
                        />

                        <section className='mt-4'>
                            <AppForm.Submit>Update</AppForm.Submit>
                        </section>
                    </form>
                </AppForm>
            </ResponsiveDialog>

            <TooltipWrapper label="Edit passkey nickname" contentClassName="text-xs font-medium">
                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setIsOpen(true)}
                >
                    <Pencil />
                    <span className="sr-only">Edit</span>
                </Button>
            </TooltipWrapper>
        </div>
    )
}