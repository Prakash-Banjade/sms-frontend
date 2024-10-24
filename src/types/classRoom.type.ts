

import { TMeta } from "./global.type";



export type TClassRoom = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string,
    description: string,
    monthlyTutionFee: number,
    monthlyFee: number,
    location: string,
    classType: string,
    totalStudentsCount: number,
    totalFemalesStudentsCount: number,
    totalMalesStudentsCount: number

}

export type TClassRoomResponse = {
    data: TClassRoom[];
    meta: TMeta;
}