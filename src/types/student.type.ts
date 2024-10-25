import { EBloodGroup, EGuardianRelation, EReligion, Gender, TMeta } from "./global.type";

export type TStudent = {
    id: string,
    createdAt: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    studentId: number,
    rollNo: number,
    classRoom: {
        id: string,
        name: string,
        parent: {
            id: string,
            name: string,
        } | null;
    },
    phone: string,
    gender: Gender,
    profileImage: {
        id: string,
        url: string
    } | null,
    // guardians: {
    //     id: string,
    //     firstName: string,
    //     lastName: string,
    //     email: string,
    //     phone: string,
    // }[],
    account: {
        id: string
    }
}

export type TStudentsResponse = {
    data: TStudent[];
    meta: TMeta;
}

export type TSingleStudent = TStudent & {
    religion: EReligion,
    caste: string,
    isPhysicallyChallenged: boolean,
    bloodGroup: EBloodGroup,
    currentAddress: string,
    permanentAddress: string,
    nationalIdCardNo: string,
    birthCertificateNumber: string,
    additionalNotes: string | null,
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
    } | null;
}