import { EVehicleType, TMeta } from "./global.type"

export type TVehicle = {
    id: string,
    createdAt: string,
    vehicleNumber: string,
    vehicleModel: string,
    capacity: number,
    yearMade: number,
    note: string | null,
    type: EVehicleType,
    driver: {
        id: string,
        firstName: string,
        lastName: string,
        phone: string,
    } | null,
}

export type TVehiclesResponse = {
    data: TVehicle[],
    meta: TMeta,
}