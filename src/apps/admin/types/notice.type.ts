import { TMeta } from "../../../types/global.type";

export type TNotice = {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string
}

export type TNoticesResponse = {
    data: TNotice[];
    meta: TMeta;
}

export type TSingleNotice = TNotice & {
    description: string;
}