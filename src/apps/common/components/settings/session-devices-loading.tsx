import { Skeleton } from '@/components/ui/skeleton'

export default function SessionDevicesLoading() {
    return (
        <div className="space-y-4">
            {[1, 2].map((index) => (
                <div
                    key={index}
                    className="flex items-start justify-between space-x-4 rounded-lg border p-4"
                >
                    <div className="flex space-x-4">
                        <Skeleton className="h-12 w-12 rounded-lg mt-3" />
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-36" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className='h-8 w-20 mt-5' />
                </div>
            ))}
        </div>
    )
}