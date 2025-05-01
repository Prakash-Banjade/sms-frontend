import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { Banknote, BookCheck, BookOpenText, Building, Calendar, CalendarDays, LayoutDashboard, Radio, Shapes, UserRoundX, UsersRound } from "lucide-react";

export const teacherSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Main",
        menuItems: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                url: "dashboard"
            },
            {
                title: "My Classes",
                icon: Building,
                url: "my-classes"
            },
            {
                title: "Students",
                icon: UsersRound,
                url: "students"
            },
            {
                title: "Attendance",
                url: "attendance",
                icon: Calendar,
                items: [
                    {
                        title: "Attendance",
                        url: "",
                    },
                    {
                        title: "Leave Requests",
                        url: "leave-requests",
                    }
                ]
            },
        ]
    },
    {
        groupLabel: "Teaching",
        menuItems: [
            {
                title: "Lesson Plan",
                url: "lesson-plans",
                icon: BookCheck,
            },
            {
                title: "Tasks",
                url: "tasks",
                icon: BookOpenText,
                items: [
                    {
                        title: "Homeworks",
                        url: "homeworks",
                    },
                    {
                        title: "Assignments",
                        url: "assignments",
                    }
                ]
            },
            {
                title: "Schedule",
                url: "schedule",
                icon: Shapes,
            },
            {
                title: "Live Classes",
                url: "live-classes",
                icon: Radio,
            },
        ]
    },
    {
        groupLabel: "Personal",
        menuItems: [
            {
                title: "My Attendance",
                url: "my-attendance",
                icon: CalendarDays,
            },
            {
                title: "My Leave Requests",
                url: "leave-requests",
                icon: UserRoundX,
            },
            {
                title: "Salary",
                url: "salary",
                icon: Banknote,
            },
        ]
    },
]