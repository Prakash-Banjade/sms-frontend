import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { AppSidebarHeader } from "./sidebar-header"
import { AppSidebarFooter } from "./sidebar-footer"
import { useAuth } from "@/contexts/auth-provider"
import { useMemo } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "@/lib/utils"

export type TSidebarMenuItem = {
    title: string,
    url: string,
    icon?: any,
    items?: Omit<TSidebarMenuItem, "icon" | "items">[]
}

export type TGroupMenuItem = {
    groupLabel: string,
    menuItems: TSidebarMenuItem[]
}

export function AppSidebar({ menuItems }: { menuItems: TGroupMenuItem[] }) {
    return (
        <Sidebar variant="floating" collapsible="icon">
            <AppSidebarHeader />
            <SidebarContent className="overflow-hidden">
                <ScrollArea className="max-h-full overflow-auto">
                    {
                        menuItems.map((item) => (
                            <SidebarGroup key={item.groupLabel}>
                                <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {item.menuItems.map((item) => item.items?.length
                                        ? <CollapsibleMenuItem key={item.title} item={item} />
                                        : <NonCollapsibleMenuItem key={item.title} item={item} />
                                    )}
                                </SidebarMenu>
                            </SidebarGroup>
                        ))
                    }
                </ScrollArea>
            </SidebarContent>
            <AppSidebarFooter />
        </Sidebar>
    )
}

export function NonCollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    const location = useLocation();
    const { payload } = useAuth();

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={`/${payload?.role}/${item.url}` === location.pathname}>
                <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function CollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    const location = useLocation();
    const { payload } = useAuth();

    const defaultOpen = useMemo<boolean>(() => {
        return !!item.items?.some((subItem) => `/${payload?.role}/${item.url}/${subItem.url}` === location.pathname)
    }, [location, payload])

    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={defaultOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                            const isActive = `/${payload?.role}/${item.url}/${subItem.url}` === location.pathname

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={isActive}>
                                        <Link to={item.url + (!!subItem.url ? ('/' + subItem.url) : '')} className={cn(isActive && "font-medium")}>
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
