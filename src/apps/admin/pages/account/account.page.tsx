import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { ProfileAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-provider";
import { getImageUrl } from "@/lib/utils";
import ChangePasswordForm from "../../components/account/change-password-form";


export default function AccountPage() {
  const { payload } = useAuth();

  return (
    <ContainerLayout
      title="My Account"
      description="View and edit your account details."
    >
      <div className="space-y-8">
        <section className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="flex items-center space-x-4">
            <ProfileAvatar name={payload?.firstName + " " + payload?.lastName} src={getImageUrl(payload?.profileImageUrl, "w=96")} className="size-24" />
            <div>
              <p className="font-semibold text-xl mb-2">{payload?.firstName} {payload?.lastName}</p>
              <p className="text-muted-foreground">{payload?.email}</p>
              <Badge variant={'outline'} className="capitalize">{payload?.role}</Badge>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <ChangePasswordForm />
        </section>
      </div>
    </ContainerLayout>
  )
}