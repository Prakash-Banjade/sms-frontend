import { BookOpenText, Building, Bus, LayoutDashboard, UsersRound } from "lucide-react"

export type TSidebarMenuItem = {
    title: string,
    url: string,
    icon?: any,
    items?: Omit<TSidebarMenuItem, "icon" | "items">[]
}

export type TGroupMenuItem = {
    groupLabel: string,
    menuItems: TSidebarMenuItem[]
}

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
    }
]
