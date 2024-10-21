import { AsideLinksLayoutProps } from "@/components/aside-layout.tsx/aside-links-layout";

export const academicYearAsideQuickLinks: AsideLinksLayoutProps["quickLinks"] = {
    title: "Quick Links",
    items: [
        {
            title: "View All Academic Years",
            url: "/admin/academic-years",
        },
        {
            title: "Academic Year Calendar",
            // url: "/admin/academic-years/calendar",
            url: "#",
        },
        {
            title: "Academic Year Reports",
            url: "#",
        }
    ]
}

export const academicYearAsideRelatedActions: AsideLinksLayoutProps["relatedActions"] = {
    title: "Related Actions",
    items: [
        {
            title: "Manage Classrooms",
            url: "/admin/class-rooms",
        },
        {
            title: "Manage Subjects",
            url: "/admin/subjects",
        },
        {
            title: "Manage Class Routine",
            url: "/admin/class-routine",
        }
    ]
}