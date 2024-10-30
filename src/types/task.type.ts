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
    classRoomId: string,
    classRoomName: string,
    parentClassId: string | null,
    parentClassName: string | null
}

export type TasksResponse = {
    data: Task[],
    meta: TMeta;
}