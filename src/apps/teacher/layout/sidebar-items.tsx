import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { LayoutDashboard } from "lucide-react";

export const teacherSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Dashboard",
        menuItems: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                url: "dashboard"
            }
        ]
    }
]