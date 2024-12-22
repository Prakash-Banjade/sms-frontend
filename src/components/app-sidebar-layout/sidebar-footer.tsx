import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useLogoutMutation } from "@/hooks/useLogoutMutation"
import { ChevronUp, LoaderCircle, LogOut } from "lucide-react"
import { ProfileAvatar } from "../ui/avatar"
import { getImageUrl } from "@/lib/utils"
import { useCurrentUser } from "@/contexts/user-provider"

export const AppSidebarFooter = () => {
    const { handleLogout, isPending } = useLogoutMutation();

    const { isLoading, user } = useCurrentUser();

    if (isLoading || !user) return null;

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className="h-12">
                                <ProfileAvatar src={getImageUrl(user.profileImageUrl, "w=40&q=70")} name={user.firstName + " " + user.lastName} className="size-10" />
                                {user?.firstName + " " + user?.lastName}
                                <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width]"
                        >
                            <DropdownMenuLabel className="break-words">{user?.email}</DropdownMenuLabel>
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