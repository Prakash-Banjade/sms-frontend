
import { TMeta } from "../../../types/global.type";
import { Teacher } from "./teacher.type";

export enum EDaysOfWeek {
    Sunday = "sunday",
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
}

export type TSubjectPlan = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    subjectName: string,
    subjectCode: string,
    content: string,
    theoryPM: number,
    theoryFM: number,
    practicalPM: number,
    practicalFM: number,
    classRoom: any, // TODO: use correct type
    teacher: Teacher

}

export type TSubjectPlanResponse = {
    data: TSubjectPlan[];
    meta: TMeta;
}

export type TChapter = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    subject: TSubjectPlan;
    title: string;
    chapterNo: string;
    content: string;
    priority: string;


}

export type TChapterResponse = {
    data: TChapter[];
    meta: TMeta;
}

