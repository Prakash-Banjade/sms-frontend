import { PropsWithChildren } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export interface ContainerLayoutProps extends PropsWithChildren {
    title: string;
    description?: React.ReactNode;
    actionLabel?: string;
    actionUrl?: string;
    actionTrigger?: React.ReactNode;
}

export default function ContainerLayout({ title, description, children, actionLabel, actionUrl, actionTrigger }: ContainerLayoutProps) {
    return (
        <div className="flex flex-col gap-6 flex-1 container mx-auto">
            <header className='mb-6 justify-between flex flex-wrap gap-3'>
                <section className='space-y-1 sm:space-y-3'>
                    <h1 className="text-3xl font-bold capitalize">{title}</h1>
                    {typeof description === 'string' && <p className="text-muted-foreground">{description}</p>}
                    {typeof description !== 'string' && description}
                </section>

                {!!actionLabel && !!actionUrl && (
                    <Button asChild>
                        <Link
                            to={actionUrl}
                        >
                            {actionLabel}
                        </Link>
                    </Button>
                )}

                {actionTrigger}
            </header>
            {children}
        </div>
    )
}