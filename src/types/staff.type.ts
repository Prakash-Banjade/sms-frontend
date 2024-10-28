import { EStaff, TMeta } from "./global.type";
import { Teacher, TSingleTeacher } from "./teacher.type";

export type TStaff = Omit<Teacher, 'teacherId' | 'teacherFullName'> & {
    staffId: number,
    type: EStaff,
    // staffFullName: string,
}

export type TStaffsResponse = {
    data: TStaff[],
    meta: TMeta,
}

export type TSingleStaff = Omit<TSingleTeacher, 'teacherId'> & {
    staffId: number,
    type: EStaff,
}