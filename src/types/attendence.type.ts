
import { EAttendanceStatus, TMeta } from "./global.type";

export enum NepaliMonths {
    Baishakh = "Baishakh",
    Jestha = "Jestha",
    Ashadh = "Ashadh",
    Shrawan = "Shrawan",
    Bhadra = "Bhadra",
    Ashwin = "Ashwin",
    Kartik = "Kartik",
    Mangsir = "Mangsir",
    Poush = "Poush",
    Magh = "Magh",
    Falgun = "Falgun",
    Chaitra = "Chaitra"
}


export type TAttendence = {
    id: string;
    name: string;
    status: EAttendanceStatus;
    date: string;
    inTime: string | null;
    outTime: string | null;
    createdAt: string;
    updatedAt: string;
}

export type TAttendencesResponse = {
    data: TAttendence[];
    meta: TMeta;
}

export type TAttendenceCount = Record<EAttendanceStatus, number> & {
    total: number;
    [key: string]: number;
};

export type TAttendenceCounts = {
    monthly: TAttendenceCount,
    yearly: TAttendenceCount
}