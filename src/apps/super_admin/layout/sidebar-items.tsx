import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar";
import { Banknote, BellRing, BookCheck, BookOpenCheck, BookOpenText, Building, Bus, Calendar, HandCoins, LayoutDashboard, Library, Settings, Shapes, Users, Users2, UsersRound } from "lucide-react"

export const superAdminSidebarMenuItems: TGroupMenuItem[] = [
    {
        groupLabel: "Dashboard",
        menuItems: [
            {
                title: "Dashboard",
                url: "dashboard",
                icon: LayoutDashboard,
            },
        ]
    },
    {
        groupLabel: "Branch Management",
        menuItems: [
            {
                title: "Branches",
                url: "branches",
                icon: Building,
                items: [
                    {
                        title: "Branch List",
                        url: "",
                    },
                    {
                        title: "Add Branch",
                        url: "new",
                    },
                ]
            },
            {
                title: "Admins",
                url: "branch-admins",
                icon: Users,
                items: [
                    {
                        title: "Admin List",
                        url: "",
                    },
                    {
                        title: "Add Admin",
                        url: "new",
                    },
                ]
            },
        ]
    },
    {
        groupLabel: "Academic Administration",
        menuItems: [
            {
                title: "Academic Year",
                url: "academic-years",
                icon: Calendar,
                items: [
                    {
                        title: "Academic Years",
                        url: "",
                    },
                    {
                        title: "Add Academic Year",
                        url: "new",
                    },
                ]
            },
            {
                title: "Class",
                url: "classes",
                icon: Building,
            },
            {
                title: "Subject",
                url: "subjects",
                icon: BookOpenText,
            },
            {
                title: "Class Routine",
                url: "class-routines",
                icon: Shapes,
            },
            {
                title: "Lesson Plan",
                url: "lesson-plans",
                icon: BookCheck,
            },
            {
                title: "Examination",
                url: "examination",
                icon: BookOpenCheck,
            },
            {
                title: "Notice",
                url: "notices",
                icon: BellRing,
            },
        ]
    },
    {
        groupLabel: "Student Administration",
        menuItems: [
            {
                title: "Students",
                url: "students",
                icon: UsersRound,
            },
            {
                title: "Attendance",
                url: "students/attendance",
                icon: Calendar,
            },
            {
                title: "Tasks",
                url: "tasks",
                icon: BookOpenText,
            },
            {
                title: "Transportation",
                url: "transportation",
                icon: Bus,
            },
            {
                title: "Dormitory",
                url: "dormitory",
                icon: Building,
            },
        ]
    },
    {
        groupLabel: "Teachers & Staffs",
        menuItems: [
            {
                title: "Teachers",
                url: "teachers",
                icon: UsersRound,
            },
            {
                title: "Non Teaching Staffs",
                url: "staffs",
                icon: Users,
            },
            {
                title: "Attendance",
                url: "employees/attendance",
                icon: Calendar,
            },
        ]
    },
    {
        groupLabel: "Library Management",
        menuItems: [
            {
                title: "Overview",
                url: "library",
                icon: Library,
            },
            {
                title: "Books Catalog",
                url: "library/books",
                icon: BookOpenText,
            },
            {
                title: "Issues & Returns",
                url: "library/issues-and-returns",
                icon: Calendar,
            },
        ]
    },
    {
        groupLabel: "Finance",
        menuItems: [
            {
                title: "Fee Management",
                url: "finance/fee-management",
                icon: Banknote,
            },
            {
                title: "Salary Management",
                url: "finance/salary-management",
                icon: HandCoins,
            },
        ]
    },
    {
        groupLabel: "Reports",
        menuItems: [
            {
                title: "Student Report",
                url: "reports/student-report",
                icon: UsersRound,
            },
            {
                title: "Teacher Report",
                url: "reports/teacher-report",
                icon: Users,
            },
            {
                title: "Staff Report",
                url: "reports/staff-report",
                icon: Users2,
            },
            {
                title: "Class Report",
                url: "reports/class-report",
                icon: Building,
            },
            {
                title: "Examination Report",
                url: "reports/examination-report",
                icon: BookOpenText,
            },
        ]
    },
    {
        groupLabel: "Settings",
        menuItems: [
            {
                title: "General Settings",
                url: "settings/general-settings",
                icon: Settings,
            }
        ]
    }
];
