import { EDayOfWeek, ESubjectType, TMeta } from "@/types/global.type"

export type TMySubject = {
    data: {
        id: string,
        subjectName: string,
        subjectCode: string,
        type: ESubjectType,
        classRoutines: {
            id: string,
            dayOfTheWeek: EDayOfWeek,
            startTime: `${string}:${string}`,
            endTime: `${string}:${string}`,
            teacher: {
                id: string,
                firstName: string,
                lastName: string
            } | null
        }[]
    }[],
    meta: TMeta,
}