import { EMonth } from "@/apps/admin/components/finance-system/fee-management/fee-billings-and-payments/fee-invoice/fee-invoice-form";
import { TMeta } from "../global.type";

export enum EChargeHeadPeriod {
    Monthly = 'monthly',
    One_Time = 'one_time',
    None = 'none'
}

export type TChargeHead = {
    id: string;
    createdAt: string;
    name: string;
    description: string | null;
    isMandatory: boolean;
    period: EChargeHeadPeriod
}

export type TChargeHeadsResponse = {
    data: TChargeHead[],
    meta: TMeta;
}

export type TFeeStructure = {
    id: string;
    createdAt: string;
    amount: number;
    chargeHead: {
        id: string;
        name: string;
        isMandatory: boolean;
    }
}

export type TFeeStructuresResponse = {
    data: TFeeStructure[],
    meta: TMeta;
}

export type TFeeStudent = {
    student: {
        id: string,
        name: string,
        rollNo: number,
        phone: string,
        email: string,
        profileImageUrl: string | null,
        classRoomName: string,
        classRoomId: string,
        lastMonth: string,
        previousDue: number,
        studentId: number,
    },
    feeStructures: {
        amount: number,
        chargeHeadId: string
    }[],
    chargeHeads: {
        id: string
        name: string
        required: string
        period: EChargeHeadPeriod
    }[],
}

export type TStudentLedgerResponse = {
    data: {
        id: string,
        date: string,
        ledgerAmount: number,
        feeInvoice: {
            id: string,
            month: EMonth,
            rcvNo: string,
            amount: number
        } | string | null,
        feePayment: {
            id: string,
            rcvNo: string,
            amount: number
        } | string | null,
    }[],
    ledgerAmount: number,
    meta: TMeta;
}

export type TLastInvoice = {
    id: string;
    invoiceNo: string;
    totalAmount: number,
    dueDate: string,
    month: number,
    feePayments: {
        amount: number
    }[],
    ledgerItem: {
        id: string;
        studentLedger: {
            amount: number
        },
    },
    items: {
        id: string;
        amount: number,
        discount: number,
        remark: string,
        chargeHead: {
            id: string;
            name: string
        }
    }[]
}