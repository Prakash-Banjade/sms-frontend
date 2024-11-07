import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar"
import { BellRing, BookOpenText, Building, Bus, Calendar, LayoutDashboard, Library, Shapes, Users, UsersRound } from "lucide-react"

export const adminSidebarMenuItems: TGroupMenuItem[] = [
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
        groupLabel: "Academic Administration",
        menuItems: [
            {
                title: "Academic Year",
                url: "academic-years",
                icon: Calendar,
                items: [
                    {
                        title: "Add Academic Year",
                        url: "academic-years/new",
                    },
                    {
                        title: "Academic Years",
                        url: "academic-years",
                    },
                ]
            },
            {
                title: "Class",
                url: "classes",
                icon: Building,
                items: [
                    {
                        title: "Add Class",
                        url: "classes/new",
                    },
                    {
                        title: "Classes List",
                        url: "classes",
                    },
                    {
                        title: "Sections List",
                        url: "classes/sections",
                    }
                ]
            },
            {
                title: "Subject",
                url: "subjects",
                icon: BookOpenText,
                items: [
                    {
                        title: "Add Subject",
                        url: "subjects/new",
                    },
                    {
                        title: "Subjects List",
                        url: "subjects",
                    }
                ]
            },
            {
                title: "Class Routine",
                url: "class-routines",
                icon: Shapes,
                items: [
                    {
                        title: "Add Class Routine",
                        url: "class-routines/new",
                    },
                    {
                        title: "Class Routine List",
                        url: "class-routines",
                    }
                ]
            },
            {
                title: "Notice",
                url: "notices",
                icon: BellRing,
            }
        ]
    },
    {
        groupLabel: "Student Administration",
        menuItems: [
            {
                title: "Student Management",
                url: "students",
                icon: UsersRound,
                items: [
                    {
                        title: "Students",
                        url: "students",
                    },
                    {
                        title: "New Registration",
                        url: "students/new-registration",
                    },
                    {
                        title: "Enrollments",
                        url: "students/enrollments",
                    },
                    {
                        title: "Change Class",
                        url: "students/change-class",
                    },
                    {
                        title: "Promotion",
                        url: "students/promote",
                    },
                ]
            },
            {
                title: "Attendance",
                url: "students/attendance",
                icon: Calendar,
                items: [
                    {
                        title: "View Attendance",
                        url: "students/attendance",
                    },
                    {
                        title: "Leave Requests",
                        url: "students/attendance/leave-requests",
                    }
                ]
            },
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
                title: "Transportation",
                url: "transportation",
                icon: Bus,
                items: [
                    {
                        title: "Vehicles",
                        url: "transportation/vehicles",
                    },
                    {
                        title: "Route Stops",
                        url: "transportation/route-stops",
                    },
                ]
            },
            {
                title: "Dormitory",
                url: "dormitory",
                icon: Building,
                items: [
                    {
                        title: "Room Type",
                        url: "dormitory/room-types",
                    },
                    {
                        title: "Dormitory",
                        url: "dormitory",
                    },
                    {
                        title: "Dormitory Rooms",
                        url: "dormitory/dormitory-rooms",
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
                url: "teachers",
                icon: UsersRound,
                items: [
                    {
                        title: "Add Teacher",
                        url: "teachers/new",
                    },
                    {
                        title: "Teacher List",
                        url: "teachers",
                    }
                ]
            },
            {
                title: "Non Teaching Staffs",
                url: "staffs",
                icon: Users,
                items: [
                    {
                        title: "Add Staff",
                        url: "staffs/new",
                    },
                    {
                        title: "Staffs List",
                        url: "staffs",
                    }
                ]
            },
            {
                title: "Attendance",
                url: "employees/attendance",
                icon: Calendar,
                items: [
                    {
                        title: "View Attendance",
                        url: "employees/attendance",
                    },
                    {
                        title: "Leave Requests",
                        url: "employees/leave-requests",
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
                url: "library",
                icon: Library,
            },
            {
                title: "Manage",
                url: "library/books",
                icon: BookOpenText,
                items: [
                    {
                        title: "Add New Book",
                        url: "library/books/new",
                    },
                    {
                        title: "Books Catalog",
                        url: "library/books",
                    },
                    {
                        title: "Book Categories",
                        url: "library/books/categories",
                    }
                ]
            },
            {
                title: "Issues & Returns",
                url: "library/issues-and-returns",
                icon: Calendar,
            },
        ]
    }
]
