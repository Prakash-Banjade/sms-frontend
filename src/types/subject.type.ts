import { ESubjectChapterPriority, TMeta } from "./global.type";

export type TSubject = {
    id: string,
    createdAt: string,
    updatedAt: string,
    subjectName: string,
    subjectCode: string,
    theoryPM: number,
    theoryFM: number,
    practicalPM: number,
    practicalFM: number,
    content: string,
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