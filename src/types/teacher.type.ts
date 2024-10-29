import { TEntityWithAttendance, TEntityWithAttendanceUpdate } from "./attendence.type";
import { EBloodGroup, EMaritalStatus, Gender, TMeta } from "./global.type";
import { TStudentsWithAttendenceResponse } from "./student.type";

export type Teacher = {
    id: string,
    createdAt: string,
    firstName: string,
    lastName: string,
    teacherId: number,
    teacherFullName: string,
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

export type TeacherWithAttendanceResponse = (TEntityWithAttendance & {})[]

export type TeacherWithAttendanceUpdate = (TEntityWithAttendanceUpdate & {})[]