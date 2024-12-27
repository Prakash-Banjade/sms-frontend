import { EDayOfWeek, ERoutineType, TMeta } from "./global.type";

export type TClassRoutine = {
    id: string,
    createdAt: string,
    updatedAt: string,
    dayOfTheWeek: EDayOfWeek,
    startTime: string,
    endTime: string,
    type: ERoutineType,
    classRoom: {
        id: string,
        name: string,
        parent: {
            id: string,
            name: string
        } | null,
    },
    subject: {
        id: string,
        subjectName: string,
        subjectCode: string,
    },
    teacher: {
        id: string,
        firstName: string,
        lastName: string
    } | null
}

export type TClassRoutineResponse = {
    data: TClassRoutine[];
    meta: TMeta;
}