import { useGetSessionDevices } from '../../data-access/account-data-access'
import { TLoginDevice } from '@/types/account/account.type';
import { Card } from '@/components/ui/card';
import { UAParser } from 'ua-parser-js'
import { Button } from '@/components/ui/button';
import { Chrome, CircleCheck, Globe, Laptop, LogOut, Smartphone } from 'lucide-react';
import SessionDevicesLoading from './session-devices-loading';

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

    const handleSignOut = (deviceId: string) => {
        console.log(deviceId);
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
                        <div className="flex items-center space-x-10">
                            <h4 className="font-medium" title='Device'>
                                {
                                    !!deviceInfo.device?.model
                                        ? `${deviceInfo.device?.vendor} (${deviceInfo.device?.model})`
                                        : deviceInfo.os?.name ?? "Unknown"
                                }
                            </h4>
                            {
                                d.current && <p className='text-sm flex items-center gap-1'>
                                    <CircleCheck className='text-success' size={18} />
                                    Your current session
                                </p>
                            }
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            {<Chrome className="size-4" />}
                            <span title="Browser">{deviceInfo.browser?.name ?? "Unknown"}</span>
                            <span>•</span>
                            <Globe className="size-4" />
                            <span title='Operating System'>{deviceInfo.os?.name ?? "Unknown"}</span>
                        </div>
                        <div className="grid gap-1 text-sm text-muted-foreground mt-1">
                            <div>First login: {new Date(d.firstLogin).toDateString()}</div>
                            <div>Last active: {new Date(d.lastLogin).toDateString()}</div>
                        </div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleSignOut(d.deviceId)}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                </Button>
            </div>
        </Card >
    )
}