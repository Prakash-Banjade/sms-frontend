import { Button } from '@/components/ui/button'
import { useAxios } from '@/services/api';
import { startAuthentication } from '@simplewebauthn/browser';
import { KeyRound } from 'lucide-react'
import { useState } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { loginFormSchemaType } from './login-form';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { TAuthPayload, useAuth } from '@/contexts/auth-provider';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryKey } from '@/react-query/queryKeys';

const passkeyLoginSchema = z.string().email({ message: "Enter your valid email address" })

type Props = {
    isPending: boolean,
    setIsPending: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PasskeyLoginButton({ isPending, setIsPending }: Props) {
    const axios = useAxios();
    const [error, setError] = useState<string | null>(null);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useFormContext<loginFormSchemaType>();

    const handleLoginWithPassKey = async () => {
        const email = form.getValues('email');

        const { success } = passkeyLoginSchema.safeParse(email);

        if (!success) {
            form.setError('email', { message: 'Enter your valid email', type: 'pattern' });
            form.setFocus('email');
            return
        }

        setError(null);
        setIsPending(true);
        try {
            const response = await axios.post(`/${QueryKey.WEB_AUTHN}/login`, {
                email: form.getValues('email')
            });

            const challengePayload = response.data?.challengePayload;

            if (!challengePayload) throw new Error('Failed to login with passkey'); // todo: show some error msg

            try {
                const authenticationResponse = await startAuthentication({ optionsJSON: challengePayload });

                const response = await axios.post(`/${QueryKey.WEB_AUTHN}/verify-login`, {
                    authenticationResponse,
                    email,
                });

                if (!response.data) throw new Error('Failed to login with passkey');

                if ('access_token' in response.data) {
                    setAuth({
                        accessToken: response.data.access_token,
                        user: response.data.user,
                    });
                    const payload: TAuthPayload = jwtDecode(response.data.access_token);

                    navigate(location.state?.from?.pathname || `/${payload.role}/dashboard`, { replace: true });
                }

            } catch (e) {
                setErrorMsg(e, setError, form);
            }

        } catch (e) {
            setErrorMsg(e, setError, form);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <section className='flex flex-col gap-1'>
            <Button
                variant={"outline"}
                type="button"
                onClick={handleLoginWithPassKey}
                disabled={isPending}
            >
                <KeyRound className="h-4 w-4" />
                Sign in with Passkey
            </Button>

            {
                error && (
                    <p className="text-sm text-destructive mt-1">{error}</p>
                )
            }
        </section>
    )
}

function setErrorMsg(error: unknown, setError: React.Dispatch<React.SetStateAction<string | null>>, form: UseFormReturn<loginFormSchemaType>) {
    if (error instanceof AxiosError) {
        const err = error.response?.data?.message;

        if (err instanceof Object && 'message' in err) {
            if (!!err?.field) {
                form.setError(err.field, { message: err?.message });
                form.setFocus(err.field);
            }
        } else if (typeof error.response?.data?.message === 'string') {
            setError(error.response?.data?.message);
        } else {
            setError(error.message);
        }
    } else {
        setError('Something went wrong');
    }
}