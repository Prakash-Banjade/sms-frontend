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
            createdAt: string;
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
            createdAt: string;
            profileImageUrl: string | null;
            totalLeaveRequests: string;
        }[];
        total: string;
    }
}