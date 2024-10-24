
import { TMeta } from "./global.type";

export type TNotice = {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    date: string


}

export type TNoticeResponse = {
    data: TNotice[];
    meta: TMeta;
}