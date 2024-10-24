import { EDormitoryType, TMeta } from "./global.type"

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