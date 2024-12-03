import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar, TGroupMenuItem } from "./sidebar";
import { ThemeToggleBtn } from "../theme-toggle";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAuth } from "@/contexts/auth-provider";
import { Suspense, useMemo } from "react";
import { useGetActiveAcademicYear } from "@/apps/admin/components/academic-year/actions";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Loader } from "lucide-react";


export default function AppRootLayout({ menuItems }: { menuItems: TGroupMenuItem[] }) {
    const { payload } = useAuth();
    const location = useLocation();

    const active = useMemo(() => {
        const menuItem = menuItems.find(group => group.menuItems
            .some(item => location.pathname.includes(`/${payload?.role}/${item.url}`)))
            ?.menuItems?.find(item => location.pathname.includes(`/${payload?.role}/${item.url}`))

        const item = menuItem?.items?.length
            ? menuItem.items.find(item => location.pathname === `/${payload?.role}/${menuItem.url}/${item.url}`)
            : undefined;

        return { menuItem, item };
    }, [location, menuItems])

    const { data, isLoading } = useGetActiveAcademicYear({});

    return (
        <SidebarProvider>
            <AppSidebar menuItems={menuItems} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink asChild>
                                    <Link to={`/${payload?.role}/${active.menuItem?.url}`}>
                                        {active.menuItem?.title}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {
                                active.item && <>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{active.item?.title}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            }
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto flex items-center gap-10">
                        <span>
                            {
                                isLoading ? <Skeleton className="h-4 w-4" /> : <Badge variant="outline" className="text-sm">{data?.name}</Badge>
                            }
                        </span>

                        <ThemeToggleBtn />
                    </div>
                </header>
                <main className="p-6 h-full">
                    <Suspense fallback={<Skeleton className="h-full"></Skeleton>}>
                        <Outlet />
                    </Suspense>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}