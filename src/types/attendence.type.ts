
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

export type TUpdateAttendances = {
    id?: string;
    accountId: string;
    inTime?: string;
    outTime?: string;
    status: EAttendanceStatus;
    date: string;
}[]

export type TEntityWithAttendance = {
    id: string,
    firstName: string,
    lastName: string,
    account: {
        id: string
    }
    attendance: {
        id: string
        status: EAttendanceStatus,
        date: string,
    } | null;
}

export type TEntityWithAttendanceUpdate = {
    id: string
    firstName: string,
    staffId?: number;
    teacherId?: number;
    lastName: string,
    account: {
        id: string
    }
    attendance: {
        id?: string
        status: EAttendanceStatus,
        date: string,
    } | null;
}