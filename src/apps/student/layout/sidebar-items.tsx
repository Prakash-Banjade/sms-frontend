

import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { Bus, Calendar, FileCheck2, LayoutDashboard, Shapes, Users, UsersRound, Library, Images, GitPullRequest, BookOpenText } from "lucide-react";

export const studentSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Dashboard",
        menuItems: [
            {
                title: "Dashboard",
                url: "dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        groupLabel: "Academics",
        menuItems: [
            {
                title: "Tasks",
                url: "tasks",
                icon: BookOpenText,
                items: [
                    {
                        title: "Homeworks",
                        url: "tasks/homeworks",
                    },
                    {
                        title: "Assignments",
                        url: "tasks/assignments",
                    }
                ]
            },
            {
                title: "Attendance",
                url: "attendance",
                icon: FileCheck2,
            },
            {
                title: "Class Routine",
                url: "class-routine",
                icon: Shapes,
            },
            {
                title: "Result",
                url: "results",
                icon: UsersRound,
            },
            {
                title: "Exam Routine",
                url: "exam-routine",
                icon: Calendar,
            },
            {
                title: "Teachers",
                url: "teachers",
                icon: Users,
            },
            {
                title: "Leave Request",
                url: "leave-request",
                icon: GitPullRequest,
            },
        ],
    },
    {
        groupLabel: "Transportation",
        menuItems: [
            {
                title: "Bus Route",
                url: "bus-route",
                icon: Bus,
            },
            {
                title: "Bus Info",
                url: "bus-info",
                icon: Bus,
            },
        ],
    },
    {
        groupLabel: "Finance",
        menuItems: [
            {
                title: "Fee",
                url: "fees",
                icon: FileCheck2,
            },
        ],
    },
    {
        groupLabel: "School Resources",
        menuItems: [
            {
                title: "Library",
                url: "library",
                icon: Library,
            },
            {
                title: "Gallery",
                url: "gallery",
                icon: Images,
            },
        ],
    },

];
