import { Button } from '@/components/ui/button'
import { ResponsiveAlertDialog } from '@/components/ui/responsive-alert-dialog'
import { TooltipWrapper } from '@/components/ui/tooltip'
import { useAppMutation } from '@/hooks/useAppMutation'
import { QueryKey } from '@/react-query/queryKeys'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

type Props = { credentialId: string }

export default function DeletePassKeyBtn({ credentialId }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const { mutateAsync, isPending } = useAppMutation()

    const handleDelete = async () => {
        mutateAsync({
            endpoint: QueryKey.WEB_AUTHN,
            id: credentialId,
            method: 'delete',
            invalidateTags: [QueryKey.WEB_AUTHN],
        })
    }

    return (
        <>
            <ResponsiveAlertDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Delete Passkey"
                description="Are you sure you want to delete this passkey?"
                isLoading={isPending}
                action={handleDelete}
            />

            <TooltipWrapper label="Remove this passkey" contentClassName="text-xs font-medium">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    type='button'
                    onClick={() => setIsOpen(true)}
                >
                    <Trash2 />
                    <span className="sr-only">Delete</span>
                </Button>
            </TooltipWrapper>
        </>
    )
}