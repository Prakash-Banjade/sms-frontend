import { TEntityWithAttendance, TEntityWithAttendanceUpdate } from "./attendence.type";
import { EBloodGroup, EGuardianRelation, EReligion, Gender, IFileUploadResponse, TMeta } from "../../../types/global.type";

export type TStudent_BasicInfo = {
    id: string,
    fullName: string,
    rollNo: number,
    studentId: number,
    classRoomName: string;
    faculty: string;
}

export type TStudent_BasicInfoResponse = {
    data: TStudent_BasicInfo[];
    meta: TMeta;
}

export type TStudent = TStudent_BasicInfo & {
    phone: string,
    email: string,
    dob: string,
    gender: Gender,
    profileImageUrl: string | null,
    classRoomName: string,
    classRoomId: string,
    classRoom: string,
    parentClassId: string,
    parentClass: string,
    routeStopId: string | null;
    routeStop: string | null;
    accountId: string;
    faculty: string;
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
    studentId: string,
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
    religion: EReligion,
    caste: string,
    isPhysicallyChallenged: boolean,
    bloodGroup: EBloodGroup,
    currentAddress: string,
    permanentAddress: string,
    nationalIdCardNo: string,
    birthCertificateNumber: string,
    documentAttachments: IFileUploadResponse['files'],
    bankName: string,
    bankAccountName: string,
    bankAccountNumber: string,
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
        receiveNotification: boolean,
    }[],
    dormitoryRoom: {
        id: string,
        roomNumber: number,
    } | null;
    routeStop: {
        id: string,
        name: string,
        vehicle: {
            id: string,
            vehicleNumber: string
        } | null
    } | null;
    account: {
        id: string;
        profileImage: {
            id: string,
            url: string,
        } | null,
    },
}

export type TStudentsWithAttendenceResponse = (TEntityWithAttendance & {
    rollNo: number
})[]

export type TStudentsWithAttendenceUpdate = (TEntityWithAttendanceUpdate & { rollNo: number })[]

export type TLibraryStudent = {
    id: string,
    name: string,
    rollNo: number,
    phone: string,
    email: string,
    profileImageUrl: string | null,
    classRoomName: string,
    transactionCount: string;
}

export type TStudentsWithLedgerResponse = {
    data: (TStudent_BasicInfo & { ledgerAmount: number })[],
    meta: TMeta;
}