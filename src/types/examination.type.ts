import { TMeta } from "./global.type";

export type TExamType = {
    id: string,
    createdAt: string,
    name: string,
    description: string | null
}

export type TExamTypesResponse = {
    data: TExamType[];
    meta: TMeta;
}

export type TMarkGrade = {
    id: string,
    gradeName: string,
    gradeScale: number,
    percentFrom: number,
    percentTo: number,
    gpaFrom: number,
    gpaTo: number,
    description: string | null,
}

export type TMarkGradesResponse = {
    data: TMarkGrade[];
    meta: TMeta;
}

export type TExam = {
    id: string,
    createdAt: string,
    examType: string,
    classRoom: string,
    parentClass: string | null,
}

export type TExamsResponse = {
    data: TExam[];
    meta: TMeta;
}

export type TSingleExam = {
    id: string,
    createdAt: string,
    examType: {
        id: string,
        name: string,
    },
    classRoom: {
        id: string,
        name: string,
        parent: {
            id: string,
            name: string,
        } | null,
    },
    examSubjects: {
        id: string,
        subject: {
            id: string,
            subjectCode: string,
            subjectName: string,
        },
        duration: number,
        examDate: string,
        startTime: string,
        fullMark: number,
        passMark: number,
        venue: string,
    }
}