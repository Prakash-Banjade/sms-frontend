import { TEntityWithAttendance, TEntityWithAttendanceUpdate } from "./attendence.type";
import { EStaff, TMeta } from "../../../types/global.type";
import { Teacher, TSingleTeacher } from "./teacher.type";

export type TStaff = Omit<Teacher, 'teacherId' | 'teacherFullName'> & {
    staffId: number,
    type: EStaff,
}

export type TStaffsResponse = {
    data: TStaff[],
    meta: TMeta,
}

export type TSingleStaff = Omit<TSingleTeacher, 'teacherId'> & {
    staffId: number,
    type: EStaff,
}

export type StaffWithAttendanceResponse = (TEntityWithAttendance & {
    type: EStaff;
})[]

export type StaffWithAttendanceUpdate = (TEntityWithAttendanceUpdate & {
    type: EStaff;
})[]