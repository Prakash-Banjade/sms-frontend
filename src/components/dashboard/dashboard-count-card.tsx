import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { LucideProps } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type Props = {
    title: string;
    count: number | string | undefined;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    navigateTo?: string;
    isLoading?: boolean;
    footer?: string;
    className?: string;
}

export default function DashboardCountCard({ count, title, icon: Icon, navigateTo, footer, isLoading = false, className }: Props) {
    const navigate = useNavigate();

    return (
        <Card className={cn(navigateTo && 'cursor-pointer hover:bg-card/90 transition-colors', className)} onClick={() => navigateTo && navigate(`${navigateTo}`)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                {
                    isLoading ? (
                        <>
                            <Skeleton className='h-8 w-20' />
                            {
                                footer && <Skeleton className='mt-1 h-5 w-28' />
                            }
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{count}</div>
                            {
                                footer && <CardFooter className='text-xs text-muted-foreground p-0'>{footer}</CardFooter>
                            }
                        </>
                    )
                }

            </CardContent>
        </Card>
    )
}