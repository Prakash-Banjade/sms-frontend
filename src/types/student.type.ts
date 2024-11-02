import { TEntityWithAttendance, TEntityWithAttendanceUpdate } from "./attendence.type";
import { EBloodGroup, EGuardianRelation, EReligion, Gender, IFileUploadResponse, TMeta } from "./global.type";

export type TStudent = {
    id: string,
    fullName: string,
    rollNo: number,
    phone: string,
    email: string,
    dob: string,
    studentId: number,
    gender: Gender,
    profileImageUrl: string | null,
    classRoomId: string,
    classRoom: string,
    parentClassId: string,
    parentClass: string,
    accountId: string
}

export type TStudentsResponse = {
    data: TStudent[];
    meta: TMeta;
}

export type TSingleStudent = {
    id: string,
    createdAt: string,
    updatedAt: string,
    rollNo: number,
    studentId: number,
    firstName: string,
    lastName: string,
    gender: Gender,
    dob: string,
    email: string,
    phone: string,
    classRoom: {
        id: string,
        name: string,
        parent: {
            id: string,
            name: string
        }
    },
    profileImage: {
        id: string,
        url: string,
    } |null,
    religion: EReligion,
    caste: string,
    isPhysicallyChallenged: boolean,
    bloodGroup: EBloodGroup,
    currentAddress: string,
    permanentAddress: string,
    nationalIdCardNo: string,
    birthCertificateNumber: string,
    additionalNotes: string | null,
    documentAttachments: IFileUploadResponse['files'],
    bankName: string,
    bankAccountNumber: string,
    ifscCode: string,
    previousSchoolName: string,
    previousSchoolDetails: string | null,
    guardians: {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        address: string,
        occupation: string,
        profileImage: {
            id: string,
            url: string
        },
        relation: EGuardianRelation,
    }[],
    dormitoryRoom: {
        id: true,
        roomNumber: number,
    } | null;
}

export type TStudentsWithAttendenceResponse = (TEntityWithAttendance & {
    rollNo: number
})[]

export type TStudentsWithAttendenceUpdate = (TEntityWithAttendanceUpdate & {
    rollNo: number
})[]

export type TLibraryStudent = {
    id: string,
    name: string,
    rollNo: number,
    phone: string,
    email: string,
    profileImageUrl: string | null,
    classRoom: string,
    parentClass: string | null,
    transactionCount: string;
}