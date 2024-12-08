import { Role, TMeta } from "../global.type";

export enum ESalaryAdjustmentType {
    Bonus = 'bonus',
    Deduction = 'deduction',
    Advance = 'advance',
    Allowance = 'allowance',
    Unpaid = 'unpaid',
}

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
    designation: Role
};

export type TSalaryStructureResponse = {
    data: TSalaryStructure[],
    meta: TMeta
}

export type TEmployees = {
    data: {
        id: string,
        payAmount: number,
        fullName: string,
        employeeId: number,
        designation: Role
    }[],
    meta: TMeta
};

export type TSalaryEmployee = {
    employee: {
        id: string,
        payAmount: number,
        fullName: string,
        employeeId: number,
        designation: Role,
        profileImageUrl: string | null;
        phone: string;
        email: string;
    },
    basicSalary: number,
    grossSalary: number,
    allowances: {
        title: string,
        amount: number
    }[],
    lastPayrollDate: string | null;
    lastAdvanceAmount: number | null;
}

export type TLastPayroll = {
    id: string,
    date: string,
    netSalary: number,
    grossSalary: number,
    employee: {
        id: string,
        email: string,
        phone: string,
        fullName: string,
        employeeId: number,
        designation: string
    },
    salaryAdjustments: {
        id: string,
        type: ESalaryAdjustmentType,
        amount: number,
        description: string
    }[],
} | null;