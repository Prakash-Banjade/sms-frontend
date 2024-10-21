import { Separator } from '@radix-ui/react-separator';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export interface AsideLinksLayoutProps extends PropsWithChildren {
    title: string;
    description?: string;
    quickLinks?: {
        title: string;
        items: {
            title: string;
            url: string;
        }[];
    };
    relatedActions?: {
        title: string;
        items: {
            title: string;
            url: string;
        }[];
    }
}

export default function AsideLinksLayout({ title, description, quickLinks, relatedActions, children }: AsideLinksLayoutProps) {
    return (
        <div className="p-6 flex gap-12 justify-between">
            <div className="flex flex-col gap-6 flex-1">
                <header className='mb-6 space-y-3'>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    {!!description && <p className="text-muted-foreground">{description}</p>}
                </header>
                {children}
            </div>
            <aside className='2xl:w-[20%] xl:block hidden'> 
                {
                    !!quickLinks && <section>
                        <h2 className="text-2xl font-semibold mb-2">{quickLinks.title}</h2>
                        <nav className="flex flex-col space-y-2">
                            {
                                quickLinks.items?.map((item, index) => (
                                    <Link key={index} to={item.url} className="text-sm text-muted-foreground hover:underline">{item.title}</Link>
                                ))
                            }
                        </nav>
                    </section>
                }
                {
                    !!relatedActions && <>
                        <Separator className="my-6" />
                        <h2 className="text-2xl font-semibold mb-2">{relatedActions.title}</h2>
                        <nav className="flex flex-col space-y-2">
                            {
                                relatedActions.items?.map((item, index) => (
                                    <Link key={index} to={item.url} className="text-sm text-muted-foreground hover:underline">{item.title}</Link>
                                ))
                            }
                        </nav>
                    </>
                }
            </aside>
        </div>
    )
}