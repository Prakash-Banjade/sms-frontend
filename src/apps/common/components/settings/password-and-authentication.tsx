import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Role } from '@/types/global.type';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import PassKeysList from '../account/passkeys-list';
import ChangePasswordForm from '../account/change-password-form';

export default function PasswordAndAuthentication() {
    const navigate = useNavigate();

    return (
        <section>
            <section>
                <h2 className="text-2xl font-medium mb-4">Change Password</h2>

                <ChangePasswordForm />
            </section>

            <Separator className='my-12' />

            <section>
                <header className="flex justify-between items-center gap-10">
                    <h2 className="text-2xl font-medium mb-4">Passkeys</h2>

                    <Button
                        variant={'outline'}
                        size={'sm'}
                        type="button"
                        onClick={() => navigate(`/${Role.USER}/passkey/new`)}
                    >
                        <Plus /> Add a Passkey
                    </Button>
                </header>

                <p className="@lg:text-sm text-xs text-muted-foreground">
                    Passkeys are WebAuthn credentials that verify your identity through methods like touch, facial recognition,
                    a device password, or a PIN. They can serve as an alternative to passwords or be used for two-factor authentication (2FA)
                </p>

                <PassKeysList />

            </section>
        </section>
    )
}