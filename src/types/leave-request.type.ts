import { ELeaveRequestStatus, TMeta } from "./global.type";

export type TStudentLeaveRequest = {
    id: string,
    requestedOn: string,
    leaveFrom: string,
    leaveTo: string,
    title: string,
    description: string | null,
    status: ELeaveRequestStatus,
    account: {
        id: string,
        student: {
            id: string,
            studentId: number,
            firstName: string,
            lastName: string,
            rollNo: number,
            classRoom: {
                id: string,
                name: string,
                parent: {
                    id: string,
                    name: string
                } | null;
            }
        }
    }
}

export type TStudentLeaveRequestsResponse = {
    data: TStudentLeaveRequest[],
    meta: TMeta
}

export type TEmployeeLeaveRequest = {
    id: string,
    requestedOn: string,
    leaveFrom: string,
    leaveTo: string,
    title: string,
    description: string | null,
    status: ELeaveRequestStatus,
    account: {
        id: string,
        teacher: {
            id: string,
            teacherId: number,
            firstName: string,
            lastName: string,
        } | null,
        staff: {
            id: string,
            staffId: number,
            firstName: string,
            lastName: string,
        } | null,
    }
}

export type TEmployeeLeaveRequestsResponse = {
    data: TEmployeeLeaveRequest[],
    meta: TMeta
}