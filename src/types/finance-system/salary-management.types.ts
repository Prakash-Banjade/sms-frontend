import { TMeta } from "../global.type";

export type TSalaryStructure = {
    id: string;
    basicSalary: number;
    allowances: {
        title: string;
        amount: number;
    }[];
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
