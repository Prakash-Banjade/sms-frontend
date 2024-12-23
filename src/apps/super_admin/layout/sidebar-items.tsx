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
            },
            {
                title: "Admins",
                url: "admins",
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
                url: "/admin/classes",
                icon: Building,
                items: [
                    {
                        title: "Classes List",
                        url: "",
                    },
                    {
                        title: "Add Class",
                        url: "new",
                    },
                    {
                        title: "Sections List",
                        url: "sections",
                    }
                ]
            },
            {
                title: "Subject",
                url: "/admin/subjects",
                icon: BookOpenText,
                items: [
                    {
                        title: "Subjects List",
                        url: "",
                    },
                    {
                        title: "Add Subject",
                        url: "new",
                    },
                ]
            },
            {
                title: "Class Routine",
                url: "/admin/class-routines",
                icon: Shapes,
                items: [
                    {
                        title: "Class Routines",
                        url: "",
                    },
                    {
                        title: "Add Class Routine",
                        url: "new",
                    },
                ]
            },
            {
                title: "Lesson Plan",
                url: "/admin/lesson-plans",
                icon: BookCheck,
            },
            {
                title: "Examination",
                url: "/admin/examination",
                icon: BookOpenCheck,
                items: [
                    {
                        title: "Marks Grade",
                        url: "marks-grade",
                    },
                    {
                        title: "Exam Type",
                        url: "exam-type",
                    },
                    {
                        title: "Exam Setup & Evaluation",
                        url: "exam-setup",
                    },
                    {
                        title: "Exam Routine",
                        url: "exam-routines",
                    }
                ]
            },
            {
                title: "Notice",
                url: "/admin/notices",
                icon: BellRing,
            }
        ]
    },
    {
        groupLabel: "Student Administration",
        menuItems: [
            {
                title: "Student Management",
                url: "/admin/students",
                icon: UsersRound,
                items: [
                    {
                        title: "Students",
                        url: "",
                    },
                    {
                        title: "New Registration",
                        url: "new-registration",
                    },
                    {
                        title: "Enrollments",
                        url: "enrollments",
                    },
                    {
                        title: "Optional Subject Selection",
                        url: "subject-selection",
                    },
                    {
                        title: "Change Class",
                        url: "change-class",
                    },
                    {
                        title: "Promotion",
                        url: "promote",
                    },
                ]
            },
            {
                title: "Attendance",
                url: "/admin/students/attendance",
                icon: Calendar,
                items: [
                    {
                        title: "View Attendance",
                        url: "",
                    },
                    {
                        title: "Leave Requests",
                        url: "leave-requests",
                    }
                ]
            },
            {
                title: "Tasks",
                url: "/admin/tasks",
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
                title: "Transportation",
                url: "/admin/transportation",
                icon: Bus,
                items: [
                    {
                        title: "Vehicles",
                        url: "vehicles",
                    },
                    {
                        title: "Route Stops",
                        url: "route-stops",
                    },
                ]
            },
            {
                title: "Dormitory",
                url: "/admin/dormitory",
                icon: Building,
                items: [
                    {
                        title: "Room Type",
                        url: "room-types",
                    },
                    {
                        title: "Dormitory",
                        url: "",
                    },
                    {
                        title: "Dormitory Rooms",
                        url: "dormitory-rooms",
                    }
                ]
            },
        ]
    },
    {
        groupLabel: "Teachers & Staffs",
        menuItems: [
            {
                title: "Teachers",
                url: "/admin/teachers",
                icon: UsersRound,
                items: [
                    {
                        title: "Teacher List",
                        url: "",
                    },
                    {
                        title: "Add Teacher",
                        url: "new",
                    },
                ]
            },
            {
                title: "Non Teaching Staffs",
                url: "/admin/staffs",
                icon: Users,
                items: [
                    {
                        title: "Staffs List",
                        url: "",
                    },
                    {
                        title: "Add Staff",
                        url: "new",
                    },
                ]
            },
            {
                title: "Attendance",
                url: "/admin/employees",
                icon: Calendar,
                items: [
                    {
                        title: "View Attendance",
                        url: "attendance",
                    },
                    {
                        title: "Leave Requests",
                        url: "leave-requests",
                    },
                ]
            },
        ]
    },
    {
        groupLabel: "Library Management",
        menuItems: [
            {
                title: "Overview",
                url: "/admin/library",
                icon: Library,
            },
            {
                title: "Manage",
                url: "/admin/library/books",
                icon: BookOpenText,
                items: [
                    {
                        title: "Add New Book",
                        url: "new",
                    },
                    {
                        title: "Books Catalog",
                        url: "",
                    },
                    {
                        title: "Book Categories",
                        url: "categories",
                    }
                ]
            },
            {
                title: "Issues & Returns",
                url: "/admin/library/issues-and-returns",
                icon: Calendar,
            },
        ]
    },
    {
        groupLabel: "Finance",
        menuItems: [
            {
                title: "Fee Management",
                url: "/admin/finance/fee-management",
                icon: Banknote,
                items: [
                    {
                        title: "Charge Heads",
                        url: "charge-heads",
                    },
                    {
                        title: "Fee Structures",
                        url: "fee-structures",
                    },
                    {
                        title: "Billing and Payments",
                        url: "billing-and-payments",
                    }
                ]
            },
            {
                title: "Salary Management",
                url: "/admin/finance/salary-management",
                icon: HandCoins,
                items: [
                    {
                        title: "Salary Structure",
                        url: "salary-structures",
                    },
                    {
                        title: "Payroll & Payments",
                        url: "payroll-and-payments",
                    },
                ]
            }
        ]
    },
    {
        groupLabel: "Reports",
        menuItems: [
            {
                title: "Student Report",
                url: "/admin/reports/student-report",
                icon: UsersRound,
                items: [
                    {
                        title: "Task Evaluation Report",
                        url: "task-evaluation",
                    },
                    {
                        title: "Attendance Report",
                        url: "attendance",
                    },
                ]
            },
            {
                title: "Teacher Report",
                url: "/admin/reports/teacher-report",
                icon: Users,
                items: [
                    {
                        title: "Attendance Report",
                        url: "attendance",
                    },
                ]
            },
            {
                title: "Staff Report",
                url: "/admin/reports/staff-report",
                icon: Users2,
                items: [
                    {
                        title: "Attendance Report",
                        url: "attendance",
                    },
                ]
            },
            {
                title: "Class Report",
                url: "/admin/reports/class-report",
                icon: Building,
            },
            {
                title: "Examination Report",
                url: "/admin/reports/examination-report",
                icon: BookOpenText,
                items: [
                    {
                        title: "Student Wise Report",
                        url: "student-wise",
                    },
                    {
                        title: "Subject Wise Report",
                        url: "subject-wise",
                    }
                ]
            }
        ]
    },
    {
        groupLabel: "Settings",
        menuItems: [
            {
                title: "General Settings",
                url: "/admin/settings/general-settings",
                icon: Settings,
            }
        ]
    }
];
