import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { ProfileAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-provider";
import { getImageUrl } from "@/lib/utils";
import ChangePasswordForm from "../../components/account/change-password-form";
import { Separator } from "@/components/ui/separator";
import PassKeysList from "../../components/account/passkeys-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/types/global.type";

export default function AccountPage() {
    const { payload } = useAuth();
    const navigate = useNavigate();

    return (
        <ContainerLayout
            title="My Account"
            description="View and edit your account details."
        >
            <div className="space-y-8 pb-32">
                <section className="p-6">
                    <SectionHeader>Profile Information</SectionHeader>

                    <div className="flex items-center space-x-4">
                        <ProfileAvatar name={payload?.firstName + " " + payload?.lastName} src={getImageUrl(payload?.profileImageUrl, "w=96")} className="size-24" />
                        <div>
                            <p className="font-semibold text-xl mb-2">{payload?.firstName} {payload?.lastName}</p>
                            <p className="text-muted-foreground">{payload?.email}</p>
                            <Badge variant={'outline'} className="capitalize">{payload?.role}</Badge>
                        </div>
                    </div>
                </section>

                <Separator />

                <section className="p-6">
                    <SectionHeader>Change Password</SectionHeader>

                    <section className="max-w-[800px]">
                        <ChangePasswordForm />
                    </section>
                </section>

                <Separator />

                <section className="p-6">
                    <header className="flex justify-between items-center gap-10">
                        <SectionHeader>Passkeys</SectionHeader>
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            type="button"
                            onClick={() => navigate(`/${Role.USER}/passkey/new`)}
                        >
                            <Plus /> Add a Passkey
                        </Button>
                    </header>

                    <p className="text-sm text-muted-foreground">
                        Passkeys are WebAuthn credentials that verify your identity through methods like touch, facial recognition, <br />
                        a device password, or a PIN. They can serve as an alternative to passwords or be used for two-factor authentication (2FA)
                    </p>

                    <PassKeysList />

                </section>
            </div>
        </ContainerLayout>
    )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl font-medium mb-4">{children}</h2>
    )
}