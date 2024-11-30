import { TEntityWithAttendance, TEntityWithAttendanceUpdate } from "./attendence.type";
import { EBloodGroup, EDayOfWeek, EMaritalStatus, Gender, TMeta } from "./global.type";

export type Teacher = {
    id: string,
    createdAt: string,
    firstName: string,
    lastName: string,
    teacherId: number,
    gender: Gender,
    email: string,
    phone: string,
    joinedDate: string,
    dob: string,
    profileImage: {
        id: string,
        url: string
    } | null,
    account: {
        id: string,
    }
}

export type TeachersResponse = {
    data: Teacher[];
    meta: TMeta;
}

export type TSingleTeacher = Omit<Teacher, 'teacherFullName'> & {
    wage: number,
    shortDescription: string | null,
    maritalStatus: EMaritalStatus,
    qualification: string,
    bloodGroup: EBloodGroup,
    joinedDate: string,
    bankName: string,
    accountName: string,
    accountNumber: string,
}

export type TeacherWithAttendanceResponse = (TEntityWithAttendance & {
    inTime: string | null,
    outTime: string | null
})[]

export type TeacherWithAttendanceUpdate = (TEntityWithAttendanceUpdate & {
    inTime: string | null,
    outTime: string | null
})[]

export type TSingleTeacherDetail = {
    id: string;
    teacherId: number;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    wage: number;
    gender: Gender
    qualification: string;
    maritalStatus: EMaritalStatus
    bloodGroup: EBloodGroup
    joinedDate: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    shortDescription: string | null;
    accountId: string;
    profileImageUrl: string | null;
    assignedClassRooms: string[] | null[];
}

export type TeacherClassSchedule = {
    id: string,
    dayOfTheWeek: EDayOfWeek,
    startTime: string,
    endTime: string,
    classRoomName: string,
    subjectName: string
}

/**
|--------------------------------------------------
| TYPES FOR STUDENT VIEW
|--------------------------------------------------
*/

export type St_Teacher = {
    teacherId: string,
    teacherFullName: string,
    email: string
    phone: string
    profileImageUrl: string | null
    subject: string
};

export type St_TeacherResponse = {
    data: St_Teacher[],
    meta: TMeta
}