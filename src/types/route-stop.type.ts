import { TMeta } from "./global.type"

export type TRouteStop = {
    id: string,
    createdAt: string,
    name: string,
    location: string
    fare: number,
    sequence: number,
    pickUpTime: string,
    dropOffTime: string,
    vehicle: {
        id: string,
        vehicleNumber: string,
        type: string
    }
}

export type TRouteStopsResponse = {
    data: TRouteStop[],
    meta: TMeta,
}