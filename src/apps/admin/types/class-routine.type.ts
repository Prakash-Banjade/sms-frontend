import { EDayOfWeek, ERoutineType, TMeta } from "../../../types/global.type";

export type TClassRoutine = {
    id: string,
    createdAt: string,
    updatedAt: string,
    dayOfTheWeek: EDayOfWeek,
    startTime: `${string}:${string}`,
    endTime: `${string}:${string}`,
    type: ERoutineType,
    classRoom: {
        id: string,
        fullName: string,
        parent: {
            id: string
        } | null
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