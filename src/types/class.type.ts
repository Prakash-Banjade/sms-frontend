import { EClassType, TMeta } from "./global.type"

export type TClass = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    description: string | null,
    monthlyTutionFee: number,
    monthlyFee: number,
    location: string,
    classType: EClassType,
    totalStudentsCount: number,
    totalFemalesStudentsCount: number,
    totalMalesStudentsCount: number,
}

export type TClassesResponse = {
    data: TClass[],
    meta: TMeta,
}

export type TClassRoomOption = {
    id: string,
    name: string
    children: {
        id: string,
        name: string
    }[]
}

export type TClassRoomOptions = {
    data: TClassRoomOption[],
    meta: TMeta,
}