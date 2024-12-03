import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useFetchData } from "@/hooks/useFetchData"
import { useLogoutMutation } from "@/hooks/useLogoutMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { TCurrentUser } from "@/types/global.type"
import { ChevronUp, LoaderCircle, LogOut, User2 } from "lucide-react"

export const AppSidebarFooter = () => {
    const { handleLogout, isPending } = useLogoutMutation();

    const { data, isLoading } = useFetchData<TCurrentUser>({
        queryKey: [QueryKey.ME],
        endpoint: QueryKey.ME,
    });

    if (isLoading || !data) return null;

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                                <User2 /> {data?.firstName + " " + data?.lastName}
                                <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width]"
                        >
                            <DropdownMenuLabel className="break-words">{data?.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span>Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isPending}
                                className="text-left flex gap-2 items-center w-full px-2 py-1.5 text-sm hover:bg-secondary transition-colors select-none rounded-sm disabled:opacity-70"
                            >
                                {
                                    isPending
                                        ? <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            <span>Signing out...</span>
                                        </>
                                        : <span>Sign out <LogOut className="inline-block h-4 w-4 ml-2" /></span>
                                }
                            </button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}