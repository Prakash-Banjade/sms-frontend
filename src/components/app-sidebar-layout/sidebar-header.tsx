import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronsUpDown, Plus, School } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";
import { useGetBranchOptions } from "@/apps/super_admin/data-access/branches-data-access";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookie";
import { CookieKey } from "@/CONSTANTS";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SidebarSearchForm } from "./sidebar-search-form";

export function AppSidebarHeader() {
    const { isMobile, open } = useSidebar();
    const { payload } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [branch, setBranch] = useState(payload?.branchId ?? getCookie(CookieKey.BRANCH_ID));
    const queryClient = useQueryClient();

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
                                className={cn(payload?.role === Role.SUPER_ADMIN ? "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" : "pointer-events-none")}
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <School className="size-5" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="truncate font-semibold">Abhyam Academy</span>
                                    <span className="text-xs mt-1">
                                        {
                                            payload?.branchName
                                                ? payload?.branchName
                                                : branches?.find(b => b.value === branch)?.label
                                                    ? branches?.find(b => b.value === branch)?.label
                                                    : "Comming Soon..."
                                        }
                                    </span>
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
                                    <DropdownMenuItem
                                        className="gap-2 p-2"
                                        onClick={() => {
                                            deleteCookie(CookieKey.BRANCH_ID, {
                                                sameSite: import.meta.env.VITE_API_ENV === 'production' ? 'None' : 'Lax',
                                                secure: import.meta.env.VITE_API_ENV === 'production',
                                                domain: import.meta.env.VITE_API_DOMAIN,
                                            })
                                            setBranch(null);
                                            queryClient.invalidateQueries(); // invalidate all cache
                                            navigate({
                                                pathname: location.pathname,
                                                search: ""
                                            })
                                        }}
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            <School className="size-4 shrink-0" />
                                        </div>
                                        All
                                    </DropdownMenuItem>
                                    {(branches ?? []).map((branch) => (
                                        <DropdownMenuItem
                                            key={branch.value}
                                            className="gap-2 p-2"
                                            onClick={() => {
                                                setCookie(CookieKey.BRANCH_ID, branch.value, {
                                                    sameSite: import.meta.env.VITE_API_ENV === 'production' ? 'None' : 'Lax',
                                                    secure: import.meta.env.VITE_API_ENV === 'production',
                                                    domain: import.meta.env.VITE_API_DOMAIN,
                                                })
                                                setBranch(branch.value);
                                                queryClient.invalidateQueries(); // invalidate all cache
                                                navigate({
                                                    pathname: location.pathname,
                                                    search: ""
                                                })
                                            }}
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
            {open && <SidebarSearchForm />}
        </SidebarHeader>
    )
}