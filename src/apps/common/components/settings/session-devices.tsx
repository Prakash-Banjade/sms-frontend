import { useGetSessionDevices } from '../../data-access/account-data-access'
import { TLoginDevice } from '@/types/account/account.type';
import { Card } from '@/components/ui/card';
import { UAParser } from 'ua-parser-js'
import { Chrome, CircleCheck, Globe, Laptop, LogOut, Smartphone } from 'lucide-react';
import SessionDevicesLoading from './session-devices-loading';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import LoadingButton from '@/components/forms/loading-button';
import { useAuth } from '@/contexts/auth-provider';
import { format } from 'date-fns';

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
    const deviceInfo = new UAParser(d.ua).getResult();
    const { payload } = useAuth();
    const isCurrentDevice = d.deviceId === payload?.deviceId;

    const { mutateAsync, isPending } = useAppMutation();

    const handleSignOut = async (deviceId: string) => {
        await mutateAsync({
            endpoint: `${QueryKey.ACCOUNTS_DEVICES}/${deviceId}/revoke`,
            method: 'patch',
            invalidateTags: [QueryKey.ACCOUNTS_DEVICES]
        });
    }

    return (
        <Card>
            <div
                key={d.deviceId}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
            >
                <div className="flex items-center space-x-4">
                    {false ? (
                        <Smartphone className="size-20 text-muted-foreground" />
                    ) : (
                        <Laptop className="size-20 text-muted-foreground" />
                    )}

                    <div>
                        <h4 className="font-medium" title='Device'>
                            {
                                !!deviceInfo.device?.model
                                    ? `${deviceInfo.device?.vendor} (${deviceInfo.device?.model})`
                                    : deviceInfo.os?.name ?? "Unknown"
                            }
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
                </div>
                {
                    (d.signedIn && !isCurrentDevice) ? (
                        <section className='space-y-2 flex flex-col items-end'>
                            <p className='text-xs text-muted-foreground text-right'>Don't recognize something?</p>
                            <LoadingButton
                                isLoading={isPending}
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => handleSignOut(d.deviceId)}
                                loadingText='Signing out...'
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </LoadingButton>
                        </section>
                    ) : !isCurrentDevice && (
                        <p className='text-sm text-muted-foreground'>Currently <br /> signed out</p>
                    )
                }
                {
                    isCurrentDevice && <p className='text-sm flex items-center gap-2'>
                        <CircleCheck className='text-success' size={22} />
                        <span>
                            Your current <br /> session
                        </span>
                    </p>
                }
            </div>
        </Card >
    )
}