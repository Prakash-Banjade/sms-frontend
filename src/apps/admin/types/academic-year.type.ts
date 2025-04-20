import { TMeta } from "../../../types/global.type";

export type TAcademicYear = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export type TAcademicYearsResponse = {
    data: TAcademicYear[];
    meta: TMeta;
}