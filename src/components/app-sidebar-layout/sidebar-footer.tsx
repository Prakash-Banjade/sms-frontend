import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useLogoutMutation } from "@/hooks/useLogoutMutation"
import { ChevronUp, LoaderCircle, LogOut } from "lucide-react"
import { ProfileAvatar } from "../ui/avatar"
import { cn, getImageUrl } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-provider"
import { useNavigate } from "react-router-dom"

export const AppSidebarFooter = () => {
    const { handleLogout, isPending } = useLogoutMutation();
    const { payload } = useAuth();
    const navigate = useNavigate();
    const { open } = useSidebar();

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className={cn("h-12", !open && "grid place-items-center rounded-full")}>
                                <ProfileAvatar
                                    src={getImageUrl(payload?.profileImageUrl, "w=40&q=70")}
                                    name={payload?.firstName + " " + payload?.lastName}
                                    className={cn(!open ? "absolute size-8" : "size-10")}
                                />
                                {open && (
                                    <div className="flex flex-col">
                                        <span>{payload?.firstName + " " + payload?.lastName}</span>
                                        <span className="capitalize text-xs text-muted-foreground">{payload?.role?.replace("_", " ")}</span>
                                    </div>
                                )}
                                {open && <ChevronUp className="ml-auto" />}
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className={cn(open && "w-(--radix-popper-anchor-width)")}
                        >
                            <DropdownMenuLabel title={payload?.email} className="truncate">{payload?.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    navigate(`/${payload?.role}/settings`)
                                }}
                            >
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <button
                                type="button"
                                onClick={async () => {
                                    await handleLogout();
                                }}
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