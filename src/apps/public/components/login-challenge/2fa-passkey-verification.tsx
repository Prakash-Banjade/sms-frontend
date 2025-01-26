import { TAuthPayload, useAuth } from '@/contexts/auth-provider';
import { getErrMsg } from '@/lib/utils';
import { QueryKey } from '@/react-query/queryKeys';
import { useAxios } from '@/services/api';
import { EPasskeyChallengeType } from '@/types/global.type';
import { startAuthentication } from '@simplewebauthn/browser';
import { jwtDecode } from 'jwt-decode';
import { KeyRound, LoaderCircle } from 'lucide-react';
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    isExternalPending?: boolean;
    email: string;
}

export default function TwoFaPasskeyVerification({ isExternalPending, email }: Props) {
    const axios = useAxios();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const { setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingText, setLoadingText] = useState<string>('Validating email...')

    const handleVerify = async () => {
        setError(null);
        setIsPending(true);
        try {
            const response = await axios.post(`/${QueryKey.WEB_AUTHN}/auth-challenge`, {
                email,
                type: EPasskeyChallengeType.TwoFaVerify,
            });

            const challengePayload = response.data?.challengePayload;

            if (!challengePayload) throw new Error('Something seems wrong. Please try again.');

            try {
                setLoadingText('Waiting for input from browser interaction...');
                const authenticationResponse = await startAuthentication({ optionsJSON: challengePayload });
                setLoadingText('Signing in...');

                const response = await axios.post(`/${QueryKey.WEB_AUTHN}/verify-2fa`, {
                    authenticationResponse,
                    email,
                });

                if ('access_token' in response.data) {
                    setAuth({
                        accessToken: response.data.access_token,
                        user: response.data.user,
                    });
                    const payload: TAuthPayload = jwtDecode(response.data.access_token);

                    navigate(location.state?.from?.pathname || `/${payload.role}/dashboard`, { replace: true });
                }

            } catch (e) {
                if (e instanceof Error) {
                    if (e.message.includes('timed out')) {
                        setError('Verification cancelled or timeout.')
                    } else {
                        setError(e.message)
                    }
                };
                setError(getErrMsg(e) ?? 'Something went wrong. Please try again.');
            }

        } catch (e) {
            setError(getErrMsg(e) || 'Something seems wrong. Please try again.')
        } finally {
            setIsPending(false);
            setLoadingText('Validating email...');
        }
    }

    return (
        <section>
            <button
                type="button"
                className="rounded-lg w-full flex flex-col gap-2 hover:bg-secondary transition-all px-4 py-5 disabled:cursor-not-allowed disabled:opacity-80"
                disabled={isPending || isExternalPending}
                onClick={handleVerify}
            >
                {
                    isPending
                        ? (
                            <>
                                <span className="flex items-center gap-4 font-medium">
                                    <LoaderCircle size={20} className='animate-spin' /> Using passkey
                                </span>
                                <span className="text-sm ml-10 text-left text-muted-foreground">
                                    {loadingText}
                                </span>
                            </>
                        )
                        : (
                            <>
                                <span className="flex items-center gap-4 font-medium">
                                    <KeyRound size={20} /> Use a passkey
                                </span>
                                <span className="text-sm ml-10 text-left text-muted-foreground">
                                    You have registered a passkey. You will be prompted to use it.
                                </span>
                            </>
                        )
                }
            </button>
            {
                !!error && (
                    <p className='mt-1 text-sm text-destructive'>{error}</p>
                )
            }
        </section>
    )
}