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
    useSidebar,
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
import { filterSidebarMenu } from "./filter-sidebarMenu"

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
    const { search } = useSidebar();

    const filteredMenuItems = useMemo(() => {
        return filterSidebarMenu(menuItems, search);
    }, [search])

    return (
        <Sidebar
            variant="floating"
            collapsible="icon"
            // className="h-[144vh]"
        >
            <AppSidebarHeader />
            <SidebarContent className="overflow-hidden">
                <ScrollArea className="max-h-full overflow-auto">
                    {
                        filteredMenuItems.map((item) => (
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

                    {
                        filteredMenuItems.length === 0 && (
                            <SidebarGroup>
                                <SidebarGroupLabel>No results found!</SidebarGroupLabel>
                            </SidebarGroup>
                        )
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

    const isActive = `/${payload?.role}/${item.url}` === location.pathname;

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
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
    const { search } = useSidebar();

    const defaultOpen = useMemo<boolean>(() => {
        if (search.length > 0) return true;
        return !!item.items?.some((subItem) => `/${payload?.role}/${item.url}${!!subItem.url ? `/${subItem.url}` : ''}` === location.pathname)
    }, [location, payload, search])

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
                            const url = `/${payload?.role}/${item.url}${!!subItem.url ? `/${subItem.url}` : ''}`;
                            const isActive = url === location.pathname

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
