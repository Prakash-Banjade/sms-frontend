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
    account: {
        id: string,
        profileImage: {
            id: string,
            url: string
        } | null,
    },
    faculties: {
        id: string,
        name: string,
    }[]
}

export type TeachersResponse = {
    data: Teacher[];
    meta: TMeta;
}

export type TSingleTeacher = Omit<Teacher, 'teacherFullName'> & {
    shortDescription: string | null,
    maritalStatus: EMaritalStatus,
    qualification: string,
    bloodGroup: EBloodGroup,
    joinedDate: string,
    bankName: string,
    accountName: string,
    accountNumber: string,
}

export type TeacherWithAttendanceResponse = (TEntityWithAttendance & {})[]

export type TeacherWithAttendanceUpdate = (TEntityWithAttendanceUpdate & {})[]

export type SingleTeacherAssignedclass = {
    classRoomName: string | null,
    facultyName: string | null,
}

export type TSingleTeacherDetail = {
    id: string;
    teacherId: number;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
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
    assignedClassRooms: SingleTeacherAssignedclass[] | string;
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