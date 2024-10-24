

import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { Bus, Calendar, FileCheck2, LayoutDashboard, Shapes, Users, UsersRound, Library, BellRing, ClipboardList, Images, BookCheck, GitPullRequest } from "lucide-react";

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
                title: "Assignment",
                url: "assignments",
                icon: ClipboardList,
            },
            {
                title: "Homework",
                url: "homework",
                icon: ClipboardList,
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
        groupLabel: "Campus Resources",
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
    {
        groupLabel: "Request And Notification",
        menuItems: [
            {
                title: "Notice",
                url: "notice",
                icon: BellRing,
            },
            {
                title: "Leave Request",
                url: "leave-request",
                icon: GitPullRequest,
            },
        ],
    },
];
