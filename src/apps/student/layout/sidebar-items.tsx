import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { Bus, Calendar, FileCheck2, LayoutDashboard, Shapes, Users, Library, GitPullRequest, BellRing, Radio, BookA, SquareCheckBig, BookOpenCheck } from "lucide-react";

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
                title: "My Subjects",
                url: "subjects",
                icon: BookA,
            },
            {
                title: "Teachers",
                url: "teachers",
                icon: Users,
            },
            {
                title: "Class Routine",
                url: "class-routine",
                icon: Shapes,
            },
            {
                title: "Tasks",
                url: "tasks",
                icon: SquareCheckBig,
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
                title: "Attendance",
                url: "attendance",
                icon: FileCheck2,
            },
            {
                title: "Leave Request",
                url: "leave-requests",
                icon: GitPullRequest,
            },
        ],
    },
    {
        groupLabel: "Remote Learning",
        menuItems: [
            {
                title: "Live Classes",
                url: "live-classes",
                icon: Radio,
            }
        ]
    },
    {
        groupLabel: "Examination",
        menuItems: [
            {
                title: "Exam Routine",
                url: "examination/routine",
                icon: Calendar,
            },
            {
                title: "Exam Result",
                url: "examination/report",
                icon: BookOpenCheck,
            },
        ]
    },
    {
        groupLabel: "Facilities",
        menuItems: [
            {
                title: "Dormitory",
                url: "dormitory",
                icon: Bus,
            }
        ],
    },
    {
        groupLabel: "Notification",
        menuItems: [
            {
                title: "Notice",
                url: "notices",
                icon: BellRing,
            }
        ]
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
            // {
            //     title: "Gallery",
            //     url: "gallery",
            //     icon: Images,
            // },
        ],
    },

];
