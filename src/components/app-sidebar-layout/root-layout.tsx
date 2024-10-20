import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "./sidebar";
import { TGroupMenuItem } from "@/apps/admin/layout/sidebar-items";

export default function AppRootLayout({ menuItems }: { menuItems: TGroupMenuItem[] }) {
    return (
        <SidebarProvider>
            <AppSidebar menuItems={menuItems} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    {/* <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb> */}
                </header>
                <main className="">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}