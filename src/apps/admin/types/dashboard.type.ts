export type TAdminDashboardCount = {
    studentsCount: number,
    teachersCount: number,
    classRoomsCount: number,
    staffsCount: number
}

export type TDashboardLeaveRequests = {
    studentsLeaveRequests: {
        data: {
            id: string;
            leaveFrom: string;
            leaveTo: string;
            title: string;
            studentName: string;
            classRoomName: string;
            requestedOn: string;
            profileImageUrl: string | null;
            totalLeaveRequests: string;
        }[];
        total: string;
    }
    teachersLeaveRequests: {
        data: {
            id: string;
            leaveFrom: string;
            leaveTo: string;
            title: string;
            teacherName: string;
            requestedOn: string;
            profileImageUrl: string | null;
            totalLeaveRequests: string;
        }[];
        total: string;
    }
}

export type TeacherDashboard = {
    totalClasses: number,
    pendingAssignments: number,
    pendingLeaveRequests: number,
    teacherPayAmount: number
}

export type TeacherTodaySchedule = {
    id: string
    startTime: string,
    endTime: string,
    classRoomName: string,
    subjectName: string
}