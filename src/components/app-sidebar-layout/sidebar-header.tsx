import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronsUpDown, Plus, School } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";
import { useGetBranchOptions } from "@/apps/super_admin/data-access/branches-data-access";
import { useNavigate } from "react-router-dom";

export function AppSidebarHeader() {
    const { isMobile } = useSidebar();
    const { payload } = useAuth();
    const navigate = useNavigate();

    const { data: branches } = useGetBranchOptions({
        options: {
            enabled: payload?.role === Role.SUPER_ADMIN
        }
    });

    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <School className="size-5" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Abhyam Academy</span>
                                    <span className="text-xs mt-1">Comming Soon...</span>
                                </div>
                                {
                                    (payload?.role === Role.SUPER_ADMIN && !!branches?.length) && (<ChevronsUpDown className="ml-auto" />)
                                }
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        {
                            (payload?.role === Role.SUPER_ADMIN && !!branches?.length) && (
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    align="start"
                                    side={isMobile ? "bottom" : "right"}
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                                        Branches
                                    </DropdownMenuLabel>
                                    {(branches ?? []).map((branch) => (
                                        <DropdownMenuItem
                                            key={branch.value}
                                            className="gap-2 p-2"
                                        >
                                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                                <School className="size-4 shrink-0" />
                                            </div>
                                            {branch.label}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 p-2" onClick={() => navigate("/super_admin/branches?new-branch=true")}>
                                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                            <Plus className="size-4" />
                                        </div>
                                        <div className="font-medium text-muted-foreground">Add branch</div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            )
                        }
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    )
}