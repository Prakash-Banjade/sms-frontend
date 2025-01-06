import { ProfileAvatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ConfirmByPasskey } from "../../components/sudo-access-confirm/confirm-by-passkey";
import { ConfirmByPassword } from "../../components/sudo-access-confirm/confirm-by-password";
import { useGetWebAuthnCredentials } from "@/apps/admin/data-access/account-data-access";
import SudoAccessConfirmLoading from "../../components/sudo-access-confirm/sudo-access-confirm-loading";
import { School } from "lucide-react";

type Props = {
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SudoActionConfirmPage({ setIsVerified }: Props) {
    const { payload } = useAuth();
    const [confirmOption, setConfirmOption] = useState<'password' | 'passkey'>('password');
    const { data: credentials, isLoading } = useGetWebAuthnCredentials({})

    useEffect(() => {
        if (credentials?.length) setConfirmOption('passkey');
    }, [credentials])

    if (isLoading) return <SudoAccessConfirmLoading />;

    return (
        <div className="absolute inset-0 -top-[20%] flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 p-4">
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mx-auto">
                    <School className="size-8" />
                </div>
                <h1 className="text-3xl text-center font-light">Confirm access</h1>

                <Card className="p-3">
                    <div className="flex items-center gap-3">
                        <ProfileAvatar src={getImageUrl(payload?.profileImageUrl, "w=40&q=70")} name={payload?.firstName + " " + payload?.lastName} className="size-10" />
                        <div>
                            <span className="text-sm">Signed in as</span> <span className="font-medium">{payload?.email}</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-secondary/20">
                    {
                        confirmOption === 'passkey' ? (
                            <ConfirmByPasskey setIsVerified={setIsVerified} />
                        ) : (
                            <ConfirmByPassword setIsVerified={setIsVerified} />
                        )
                    }
                </Card>

                {
                    !!credentials?.length && <Card className="p-4">
                        <h3 className="font-semibold mb-3">Having problems?</h3>
                        {
                            <button
                                type="button"
                                onClick={() => setConfirmOption(confirmOption === 'passkey' ? 'password' : 'passkey')}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                {
                                    confirmOption === 'passkey' ? (
                                        <span>Use your password</span>
                                    ) : (
                                        <span>Use your passkey</span>
                                    )
                                }
                            </button>
                        }
                    </Card>
                }

                {/* Tip Section */}
                <p className="text-center text-sm text-muted-foreground">
                    You are entering sudo mode.
                </p>
            </div>
        </div>
    )
}

