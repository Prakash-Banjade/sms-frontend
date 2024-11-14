import { ESubjectChapterPriority, ESubjectType, TMeta } from "./global.type";

export type TSubject = {
    id: string,
    createdAt: string,
    subjectName: string,
    subjectCode: string,
    theoryPM: number,
    theoryFM: number,
    practicalPM: number,
    practicalFM: number,
    content: string,
    type: ESubjectType,
    classRoom: {
        id: string,
        name: string,
    } | null;
    teacher: {
        id: string,
        firstName: string,
        lastName: string,
    } | null;
}

export type TSubjectsResponse = {
    data: TSubject[],
    meta: TMeta;
}

export type TSubjectChapter = {
    id: string,
    createdAt: string,
    updatedAt: string,
    chapterNo: number,
    title: string,
    content: string,
    priority: ESubjectChapterPriority;
}

export type TSubjectChaptersResponse = {
    data: TSubjectChapter[],
    meta: TMeta;
}

export type TOptionalSubject = {
    id: string,
    subjectId: string,
    subjectName: string,
    studentIds: string[]
}