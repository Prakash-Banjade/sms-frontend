import { TMeta } from "./global.type";

export type TAcademicYear = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isActive: boolean;
}

export type TAcademicYearsResponse = {
    data: TAcademicYear[];
    meta: TMeta;
}