import { TMeta } from "./global.type";

export enum ELessonPlanStatus {
    Not_Started = 'not_started',
    In_Progress = 'in_progress',
    Completed = 'completed',
}

export type TLessonPlan = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    createdBy: string;
    subjectName: string;
    classRooms: string[] | string;
    parentClassName: string | null;
    createdByName: string;
    status: ELessonPlanStatus;
    facultyName: string;
}

export type TLessonPlansResponse = {
    data: TLessonPlan[];
    meta: TMeta;
}

export type TSingleLessonPlan = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    description: string,
    status: ELessonPlanStatus,
    subject: {
        id: string,
        subjectName: string
    },
    createdBy: {
        firstName: string,
        lastName: string
    } | null,
    attachments: {
        id: string,
        url: string,
        originalName: string,
    }[],
    classRooms: {
        id: string,
        name: string,
        parent: {
            id: string,
            name: string,
        } | null,
        faculty: {
            id: string,
            name: string,
        }
    }[],
}