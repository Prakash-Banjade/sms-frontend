import { ETask, TMeta } from "./global.type"

export type Task = {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    submissionDate: string,
    taskType: ETask,
    marks: number | null;
    subjectName: string,
    classRooms: {
        id: string,
        name: string
    }[],
    parentClassId: string | null,
    parentClassName: string | null
}

export type TasksResponse = {
    data: Task[],
    meta: TMeta;
}

export type TSingleTask = {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    description: string,
    submissionDate: string,
    taskType: ETask,
    marks: number | null,
    subject: {
        id: string,
        subjectName: string
    },
    attatchments: {
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
        } | null
    }[]
}