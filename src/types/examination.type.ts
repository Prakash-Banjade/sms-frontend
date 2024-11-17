import { ESubjectType, TMeta } from "./global.type";
import { TStudent } from "./student.type";

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
    description: string | null,
}

export type TMarkGradesResponse = {
    data: TMarkGrade[];
    meta: TMeta;
}

export type TExam = {
    id: string,
    createdAt: string,
    examTypeId: string,
    examType: string,
    classRoom: string,
    classRoomId: string,
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
    },
    examSubjects: TExamSubject[];
};

export type TExamStudent = Pick<TStudent, 'id' | 'fullName' | 'rollNo'>;

export type TExamSubject = {
    id: string,
    createdAt: string
    examDate: string
    startTime: string
    duration: number,
    theoryFM: number,
    theoryPM: number,
    practicalFM: number,
    practicalPM: number,
    venue: string;
    subject: {
        id: string,
        subjectCode: string,
        subjectName: string,
        type: ESubjectType,
    },
}

export type TExamSubjectsResponse = {
    data: TExamSubject[];
    meta: TMeta;
}

export type TExamSubject_Raw = {
    id: string,
    examDate: string,
    startTime: string,
    duration: number,
    theoryFM: number,
    theoryPM: number,
    practicalFM: number,
    practicalPM: number,
    venue: string,
    subjectName: string,
    examType: string,
    classRoomName: string,
}

export type TExamSubjectsResponse_Raw = {
    data: TExamSubject_Raw[];
    meta: TMeta;
}

export type TExamReport = {
    id: string,
    createdAt: string,
    theoryOM: number,
    practicalOM: number,
    percentage: number,
    gpa: number,
    grade: string,
    student: {
        id: string,
    }
}

export type TExamReportsResponse = {
    data: TExamReport[];
    meta: TMeta;
}

export type TExamReportByStudent = {
    student: {
        id: string,
        firstName: string,
        lastName: string,
        rollNo: number,
        classRoomId: string,
        phone: string,
        email: string,
        parentClassId: string | null,
        classRoomName: string,
        parentClassName: string | null,
        profileImageUrl: string | null,
    },
    examReport: {
        id: string,
        examType: {
            id: string,
            name: string
        },
        examSubjects: {
            id: string,
            theoryFM: number,
            theoryPM: number,
            practicalFM: number,
            practicalPM: number,
            subject: {
                id: string,
                subjectName: string,
                subjectCode: string,
                type: ESubjectType
            },
            examReports: {
                id: string,
                theoryOM: number,
                practicalOM: number,
                percentage: number,
                gpa: number,
                grade: string
            }[]
        }[]
    } | null;
    percentage: number,
    gpa: number,
    grade: string,
    failedSubjectsCount: number,
    weakestSubject: string
}

export type TExamReportBySubject = {
    data: {
        id: string,
        theoryOM: number,
        practicalOM: number,
        percentage: number,
        gpa: number,
        grade: string,
        studentId: string,
        rollNo: number,
        fullName: string,
        classRoomName: string,
        status: string,
    }[],
    meta: TMeta,
    examSubject: {
        theoryFM: number,
        theoryPM: number,
        practicalFM: number,
        practicalPM: number,
        subjectName: string,
    },
    count: {
        totalPassed: string,
        totalFailed: string,
        theoryPassed: string,
        theoryFailed: string,
        practicalPassed: string,
        practicalFailed: string
    }
}