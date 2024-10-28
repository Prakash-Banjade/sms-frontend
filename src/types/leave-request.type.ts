import { ELeaveRequestStatus, TMeta } from "./global.type";

export type TStudentLeaveRequest = {
    id: string,
    createdAt: string,
    updatedAt: string,
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