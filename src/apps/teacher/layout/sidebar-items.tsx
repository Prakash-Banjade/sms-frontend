import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { GitPullRequest, LayoutDashboard, ListVideo, Radio } from "lucide-react";

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
    },
    {
        groupLabel: "Remote Learning",
        menuItems: [
            {
                title: "Live Classes",
                url: "live-classes",
                icon: Radio,
            },
            {
                title: "Recorded Lectures",
                url: "recorded-lectures",
                icon: ListVideo,
            }
        ]
    },
]