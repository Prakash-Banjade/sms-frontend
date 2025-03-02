import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import React, { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { Link, useLocation } from "react-router-dom";
import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { useSidebar } from "../ui/sidebar";

export default function AppBreadCrumb({ menuItems }: { menuItems: TGroupMenuItem[] }) {
    const { payload } = useAuth();
    const location = useLocation();

    const { dynamicBreadcrumb, setDynamicBreadcrumb } = useSidebar();

    const active = useMemo(() => {
        const menuItem = menuItems.find(group => group.menuItems
            .some(item => location.pathname.includes(`/${payload?.role}/${item.url}`)))
            ?.menuItems?.find(item => location.pathname.includes(`/${payload?.role}/${item.url}`))

        const item = menuItem?.items?.length
            ? (
                menuItem.items.find(item => {
                    return location.pathname === (`/${payload?.role}/${menuItem.url}${!!item.url ? `/${item.url}` : ''}`)
                })
                || menuItem.items.find(item => {
                    return location.pathname.includes(`/${payload?.role}/${menuItem.url}${!!item.url ? `/${item.url}` : ''}`)
                })
            )
            : undefined;

        return { menuItem, item };
    }, [location, menuItems]);

    useEffect(() => {
        setDynamicBreadcrumb(prev => [
            ...prev.filter(breadcrumb => {
                return breadcrumb.url && location.pathname.includes(breadcrumb.url);
            })
        ])
    }, [location]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage className="text-muted-foreground line-clamp-1">
                        {active.menuItem?.title}
                    </BreadcrumbPage>
                </BreadcrumbItem>
                {
                    active.item && <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="line-clamp-1">
                                <Link to={`/${payload?.role}/${active.menuItem?.url}/${active.item?.url}`}>
                                    {active.item?.title}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                }
                {
                    dynamicBreadcrumb.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem key={index}>
                                    {
                                        item.isEdit ? (
                                            <BreadcrumbLink asChild>
                                                <Link to={`/${payload?.role}${item.url}`} className="line-clamp-1">
                                                    {item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="line-clamp-1">{item.label}</BreadcrumbPage>
                                        )
                                    }
                                </BreadcrumbItem>

                                {
                                    item.isEdit && (
                                        <>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>Edit</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </>
                                    )
                                }
                            </React.Fragment>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}