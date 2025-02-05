import { EClassType, TMeta } from "./global.type"

export type TClass = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    description: string | null,
    admissionFee: number,
    monthlyFee: number,
    location: string,
    classType: EClassType,
    faculty: string,
    facultyId: string,
    parentClassName: string | null,
    totalStudentsCount: string,
    totalFemaleStudentsCount: string,
    totalMaleStudentsCount: string,
    classTeacherId: string | null,
    classTeacherName: string | null,
    childClassTeachers: {
        className: string,
        teacherName: string
    }[] | string | null;
}

export type TClassesResponse = {
    data: TClass[],
    meta: TMeta,
}

export type TClassRoomOptions = {
    id: string,
    name: string
    children: {
        id: string,
        name: string
    }[]
}[]

export type TSingleClassRoom = {
    id: string,
    name: string,
    description: string,
    location: string,
    classType: EClassType,
    createdAt: string,
    updatedAt: string,
    classTeacherName: string | null,
    totalStudentsCount: number,
    totalMaleStudentsCount: number,
    totalFemaleStudentsCount: number,
    facultyName: string,
    facultyId: string,
}