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
import { TGroupMenuItem, TSidebarMenuItem } from "../../apps/admin/layout/sidebar-items"
import { Link } from "react-router-dom"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { AppSidebarHeader } from "./sidebar-header"
import { AppSidebarFooter } from "./sidebar-footer"

export function AppSidebar({ menuItems }: { menuItems: TGroupMenuItem[] }) {
    // const location = useLocation();

    return (
        <Sidebar variant="floating" collapsible="icon">
            <AppSidebarHeader />
            <SidebarContent>
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
            </SidebarContent>
            <AppSidebarFooter />
        </Sidebar>
    )
}

export function NonCollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
                <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function CollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    return (
        <Collapsible
            key={item.title}
            asChild
            // defaultOpen={item.isActive}
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
                        {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                    <Link to={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
