import { TGroupMenuItem } from "@/components/app-sidebar-layout/sidebar"
import { BookOpenText, Building, Bus, Calendar, LayoutDashboard, Shapes, Users, UsersRound } from "lucide-react"

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
                        title: "Academic Year List",
                        url: "academic-years",
                    },
                    {
                        title: "Academic Year Attendance",
                        url: "#",
                    }
                ]
            },
            {
                title: "Classes",
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
                    }
                ]
            },
            {
                title: "Subjects",
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
            }
        ]
    },
    {
        groupLabel: "Student",
        menuItems: [
            {
                title: "Student Info",
                url: "#",
                icon: UsersRound,
                items: [
                    {
                        title: "Add Student",
                        url: "#",
                    },
                    {
                        title: "Student List",
                        url: "#",
                    },
                    {
                        title: "Student Attendance",
                        url: "#",
                    }
                ]
            },
            {
                title: "HomeWork",
                url: "#",
                icon: BookOpenText,
                items: [
                    {
                        title: "Add HomeWork",
                        url: "#",
                    },
                    {
                        title: "HomeWork List",
                        url: "#",
                    },
                    {
                        title: "HomeWork Report",
                        url: "#",
                    }
                ]
            },
            {
                title: "Transportation",
                url: "#",
                icon: Bus,
                items: [
                    {
                        title: "Routes",
                        url: "#",
                    },
                    {
                        title: "Vehicles",
                        url: "#",
                    },
                    {
                        title: "Assign Vehicle",
                        url: "#",
                    }
                ]
            },
            {
                title: "Dormitory",
                url: "#",
                icon: Building,
                items: [
                    {
                        title: "Room Type",
                        url: "#",
                    },
                    {
                        title: "Dormitory",
                        url: "#",
                    },
                    {
                        title: "Dormitory Rooms",
                        url: "#",
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
                url: "#",
                icon: UsersRound,
                items: [
                    {
                        title: "Add Teacher",
                        url: "#",
                    },
                    {
                        title: "Teacher List",
                        url: "#",
                    },
                    {
                        title: "Teacher Attendance",
                        url: "#",
                    }
                ]
            },
            {
                title: "Non Teaching Staffs",
                url: "#",
                icon: Users,
                items: [
                    {
                        title: "Add Non-Teaching Staff",
                        url: "#",
                    },
                    {
                        title: "Staff List",
                        url: "#",
                    },
                    {
                        title: "Staff Attendance",
                        url: "#",
                    }
                ]
            },
        ]
    }
]
