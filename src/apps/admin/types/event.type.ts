import { TMeta } from "../../../types/global.type";

export type TEvent = {
    id: string,
    createdAt: string,
    title: string,
    description: string | null,
    dateFrom: string,
    dateTo: string,
    eventLocation: string,
    members: string[] | null,
    beginTime: string,
    endingTime: string,
}

export type TEventsResponse = {
    data: TEvent[],
    meta: TMeta;
}