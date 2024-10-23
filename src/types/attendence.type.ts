
import { TMeta } from "./global.type";

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


export type TAcademicYear = {
    id: string;
    name: string;
    status: string;
    date: string;
    inTime: string;
    outTime: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

}

export type TAcademicYearsResponse = {
    data: TAcademicYear[];
    meta: TMeta;
}