import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar, TGroupMenuItem } from "./sidebar";
import { ThemeToggleBtn } from "../theme-toggle";
import { Suspense } from "react";
import { useGetActiveAcademicYear } from "@/apps/super_admin/data-access/academic-year-data-access";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import AppBreadCrumb from "./app-bread-crumb";
import { useAuth } from "@/contexts/auth-provider";
import { isAdmin } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function AppRootLayout({ menuItems }: { menuItems: TGroupMenuItem[] }) {
    const { payload } = useAuth();

    const { data, isLoading } = useGetActiveAcademicYear({
        options: { enabled: isAdmin(payload) }
    });

    return (
        <SidebarProvider>
            <AppSidebar menuItems={menuItems} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <AppBreadCrumb menuItems={menuItems} />

                    <div className="ml-auto flex items-center gap-10">
                        {
                            isAdmin(payload) && (
                                <span>
                                    {
                                        isLoading ? <Skeleton className="h-4 w-4" /> : <Badge variant="outline" className="text-sm">{data?.name}</Badge>
                                    }
                                </span>
                            )
                        }

                        <ThemeToggleBtn />
                    </div>
                </header>
                <main className="p-6 h-full">
                    <Suspense
                        fallback={(
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Please Wait...
                            </div>
                        )}
                    >
                        <Outlet />
                    </Suspense>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}