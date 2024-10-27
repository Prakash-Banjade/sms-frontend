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
                    },
                    {
                        title: "Sections List",
                        url: "classes/sections",
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
        groupLabel: "Student Administration",
        menuItems: [
            {
                title: "Student Management",
                url: "students",
                icon: UsersRound,
                items: [
                    {
                        title: "Enrollments",
                        url: "enrollments",
                    },
                    {
                        title: "New Registration",
                        url: "students/new-registration",
                    },
                    {
                        title: "Student Details",
                        url: "students",
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
                    },
                    {
                        title: "Teacher Attendance",
                        url: "teachers/attendance",
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
                    },
                    {
                        title: "Staff Attendance",
                        url: "staffs/attendance",
                    }
                ]
            },
        ]
    }
]
