import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LucideProps } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    count: number;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    navigateTo?: string;
}

export default function DashboardCountCard({ count, title, icon: Icon, navigateTo }: Props) {
    const navigate = useNavigate();

    return (
        <Card className={cn(navigateTo && 'cursor-pointer hover:bg-secondary/10')} onClick={() => navigateTo && navigate(`${navigateTo}`)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count.toLocaleString()}</div>
            </CardContent>
        </Card>
    )
}