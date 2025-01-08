import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { GitPullRequest, LayoutDashboard } from "lucide-react";

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
    },
    {
        groupLabel: "Academics",
        menuItems: [
            {
                title: "Leave Request",
                url: "leave-requests",
                icon: GitPullRequest,
            },
        ]
    }
]