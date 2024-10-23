import { TMeta } from "./global.type";

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