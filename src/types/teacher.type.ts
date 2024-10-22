

import { TMeta } from "./global.type";


export type TTeacher = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    phone: string,
    dob: string,
    profileImage: null,
    account: {
        id: string,
    }
}

export type TTeacherResponse = {
    data: TTeacher[];
    meta: TMeta;
}