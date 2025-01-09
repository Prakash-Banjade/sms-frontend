import { ProfileAvatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-provider'
import { getImageUrl } from '@/lib/utils';

export default function PersonalInfo() {
    const { payload } = useAuth();

    return (
        <section className='w-full'>
            <h2 className="text-2xl font-medium mb-4">Profile Information</h2>

            <div className="flex items-center space-x-4">
                <ProfileAvatar name={payload?.firstName + " " + payload?.lastName} src={getImageUrl(payload?.profileImageUrl, "w=96")} className="size-24" />
                <div>
                    <p className="font-semibold text-xl mb-2">{payload?.firstName} {payload?.lastName}</p>
                    <p className="text-muted-foreground">{payload?.email}</p>
                    <Badge variant={'outline'} className="capitalize">{payload?.role}</Badge>
                </div>
            </div>
        </section>
    )
}