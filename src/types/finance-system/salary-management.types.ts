import { TMeta } from "../global.type";

export type TAllowance = {
    title: string;
    amount: number;
}

export type TSalaryStructure = {
    id: string;
    basicSalary: number;
    allowances: TAllowance[] | string;
    grossSalary: number;
    fullName: string;
    employeeId: number,
    teacherId: string | null,
    staffId: string | null,
};

export type TSalaryStructureResponse = {
    data: TSalaryStructure[],
    meta: TMeta
}
