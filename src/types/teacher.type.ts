import { EBloodGroup, EMaritalStatus, Gender, TMeta } from "./global.type";

export type Teacher = {
    id: string,
    createdAt: string,
    firstName: string,
    lastName: string,
    teacherFullName: string,
    gender: string,
    email: string,
    phone: string,
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

export type TSingleTeacher = {
    id: string,
    createdAt: string,
    updatedAt: string,
    teacherId: number,
    firstName: string,
    lastName: string,
    gender: Gender,
    email: string,
    phone: string,
    dob: string,
    wage: number,
    shortDescription: string | null,
    maritalStatus: EMaritalStatus,
    qualification: string,
    bloodGroup: EBloodGroup,
    joinedDate: string,
    bankName: string,
    accountName: string,
    accountNumber: string,
    profileImage: {
        id: string,
        url: string
    } | null,
    account: {
        id: string,
    }
}