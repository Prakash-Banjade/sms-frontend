
import { TClassRoom } from "./classRoom.type";
import { TMeta } from "./global.type";
import { TTeacher } from "./teacher.type";

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
    classRoom: TClassRoom,
    teacher: TTeacher

}

export type TSubjectPlanResponse = {
    data: TSubjectPlan[];
    meta: TMeta;
}