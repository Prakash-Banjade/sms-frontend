import { ETask, ETaskSubmissionStatus, TMeta } from "../../../types/global.type"

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
    faculty: string,
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
        } | null,
        faculty: {
            id: string,
            name: string,
        },
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

export type TaskEvaluationsResponse = {
    data: {
        id: string,
        createdAt: string,
        score: number,
        feedback: string,
        submission: {
            id: string,
            createdAt: string,
            task: {
                id: string
                title: string
                marks: number,
                subject: {
                    id: string
                    subjectName: string
                }
            }
        },
        evaluator: {
            id: string,
            firstName: string,
            lastName: string
        }
    }[],
    meta: TMeta
}