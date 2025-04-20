import { useGetSessionDevices } from '../../data-access/account-data-access'
import { TLoginDevice } from '@/apps/admin/types/account/account.type';
import { Card } from '@/components/ui/card';
import { UAParser } from 'ua-parser-js'
import { Chrome, CircleCheck, Globe, Laptop, LogOut, Smartphone } from 'lucide-react';
import SessionDevicesLoading from './session-devices-loading';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import { useAuth } from '@/contexts/auth-provider';
import { format } from 'date-fns';
import { ResponsiveAlertDialog } from '@/components/ui/responsive-alert-dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SessionDevices() {
    const { data, isLoading } = useGetSessionDevices({});

    return (
        <section className='w-full'>
            <header className='mb-6'>
                <h2 className="text-2xl font-medium mb-2">Your Devices</h2>
                <p className='text-muted-foreground text-sm'>You’re signed in on these devices or have been in the last 28 days.</p>
            </header>

            <section className='space-y-2'>
                {
                    isLoading ? <SessionDevicesLoading /> : data?.map(d => <DeviceItem key={d.deviceId} d={d} />)
                }
            </section>
        </section>
    )
}

const DeviceItem = ({ d }: { d: TLoginDevice }) => {
    const { payload } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const { mutateAsync, isPending } = useAppMutation();

    const handleSignOut = async (deviceId: string) => {
        await mutateAsync({
            endpoint: `${QueryKey.ACCOUNTS_DEVICES}/${deviceId}/revoke`,
            method: 'patch',
            invalidateTags: [QueryKey.ACCOUNTS_DEVICES]
        });
    }

    const deviceInfo = new UAParser(d.ua).getResult();
    const deviceName: string | undefined = !!deviceInfo.device?.model
        ? `${deviceInfo.device?.vendor ?? "Unknown"} (${deviceInfo.device?.model})`
        : deviceInfo.os?.name
    const isCurrentDevice = d.deviceId === payload?.deviceId;


    return (
        <Card>
            <div className="@container rounded-lg border p-4">
                <section className="flex items-center gap-4">
                    <section className='@sm:block hidden'>
                        {
                            deviceInfo.device?.type === "mobile"
                                ? <Smartphone className="size-20 text-muted-foreground" />
                                : <Laptop className="size-20 text-muted-foreground" />
                        }
                    </section>

                    <section className='w-full flex justify-between @lg:items-center @lg:flex-row flex-col gap-3'>
                        <div>
                            <h4 className="font-medium flex items-center gap-2" title='Device'>
                                <span className='@sm:hidden block'>
                                    {
                                        deviceInfo.device?.type === "mobile"
                                            ? <Smartphone className="size-5 text-muted-foreground" />
                                            : <Laptop className="size-5 text-muted-foreground" />
                                    }
                                </span>
                                {deviceName ?? "Unknown"}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                {<Chrome className="size-4" />}
                                <span title="Browser">{deviceInfo.browser?.name ?? "Unknown"}</span>
                                <span>•</span>
                                <Globe className="size-4" />
                                <span title='Operating System'>{deviceInfo.os?.name ?? "Unknown"}</span>
                            </div>
                            <div className="grid gap-1 text-sm text-muted-foreground mt-1">
                                <div>First login: {new Date(d.firstLogin).toDateString()}</div>
                                <div>Last activity: {format(new Date(d.lastActivityRecord), "MMMM d, yyyy h:mm a")}</div>
                            </div>
                        </div>

                        <div>
                            {
                                (d.signedIn && !isCurrentDevice) ? (
                                    <section className='space-y-2 flex flex-col @lg:items-end'>
                                        <p className='text-xs text-muted-foreground @lg:text-right'>Don't recognize something?</p>
                                        <ResponsiveAlertDialog
                                            action={() => handleSignOut(d.deviceId)}
                                            isOpen={isOpen}
                                            setIsOpen={setIsOpen}
                                            title={`Sign out on ${deviceName ?? "this"} device?`}
                                            description={`You will no longer be signed in on ${deviceName ?? "this"} device.`}
                                            actionLabel='Sign Out'
                                            loadingText='Signing out...'
                                            isLoading={isPending}
                                        />
                                        <Button type="button" variant='outline' size='sm' onClick={() => setIsOpen(true)}>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </section>
                                ) : !isCurrentDevice && (
                                    <p className='text-sm text-muted-foreground'>Currently <br className='@xl:block hidden' /> signed out</p>
                                )
                            }
                            {
                                isCurrentDevice && <p className='text-sm flex items-center gap-2'>
                                    <CircleCheck className='text-success' size={22} />
                                    <span>
                                        Your current <br className='@xl:block hidden' /> session
                                    </span>
                                </p>
                            }
                        </div>
                    </section>
                </section>
            </div>
        </Card >
    )
}