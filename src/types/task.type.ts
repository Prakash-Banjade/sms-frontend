import { ETask, ETaskSubmissionStatus, TMeta } from "./global.type"

export type Task = {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    deadline: string,
    taskType: ETask,
    marks: number | null;
    subjectName: string,
    classRooms: {
        id: string,
        name: string
    }[] | string,
    parentClassId: string | null,
    parentClassName: string | null,
    submission: {
        status: ETaskSubmissionStatus
    }[]
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
    deadline: string,
    taskType: ETask,
    marks: number | null,
    subject: {
        id: string,
        subjectName: string
    },
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
        } | null
    }[],
    submissions: {
        status: ETaskSubmissionStatus,
        content: string,
        attachments: {
            id: string,
            url: string
        }[]
    }[]

}

export type TSingleTaskStatistics = {
    totalSubmissions: string,
    totalEvaluations: string,
    beforeDeadline: string,
    afterDeadline: string
}

export type TaskSubmission = {
    id: string,
    createdAt: string,
    updatedAt: string,
    status: ETaskSubmissionStatus,
    content: string,
    student: {
        id: string,
        firstName: string;
        lastName: string;
        studentId: number;
    },
    attachments: {
        id: string,
        url: string,
        originalName: string
    }[],
    evaluation: {
        id: string
    } | null;
}

export type TaskSubmissionsResponse = {
    data: TaskSubmission[],
    meta: TMeta;
}

