import { EDormitoryType, TMeta } from "../../../types/global.type"

export type TRoomType = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    description: string | null,
}

export type TRoomTypeResponse = {
    data: TRoomType[],
    meta: TMeta,
}

export type TDormitory = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    type: EDormitoryType,
    address: string | null,
    intake: string | null,
    description: string | null,
}

export type TDormitoryResponse = {
    data: TDormitory[],
    meta: TMeta,
}

export type TDormitoryRoom = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    roomNumber: number,
    noOfBeds: number,
    costPerBed: number,
    description: string | null,
    roomType: {
        id: string,
        name: string
    },
    dormitory: {
        id: string,
        name: string,
        address: string;
    },
    students: {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        profileImage: {
            id: string,
            url: string,
        } | null;
        classRoom: {
            id: string,
            name: string,
            parent: {
                id: string,
                name: string,
            } | null,
        }
    }[]
}

export type TDormitoryRoomResponse = {
    data: TDormitoryRoom[],
    meta: TMeta,
}

