import { TMeta } from "../../../types/global.type"

export type TEnrollment = {
    id: string,
    createdAt: string,
    enrollmentDate: string,
    registrationNumber: string,
    student: {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        dob: string,
        phone: string,
    },
    classRoom: {
        id: string,
        name: string,
        parent: {
            id: string,
            name: string,
        } | null;
        faculty: {
            id: string,
            name: string
        }
    },
    academicYear: {
        id: string,
        name: string
    }
}

export type TEnrollmentsResponse = {
    data: TEnrollment[],
    meta: TMeta,
}