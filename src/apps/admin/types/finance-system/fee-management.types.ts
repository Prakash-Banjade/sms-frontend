import { EMonth } from "@/apps/admin/components/finance-system/fee-management/fee-billings-and-payments/fee-invoice/fee-invoice-form";
import { EPaymentMethod, TMeta } from "../../../../types/global.type";

export enum EChargeHeadPeriod {
    Monthly = 'monthly',
    One_Time = 'one_time',
    None = 'none'
}

export enum EChargeHeadType {
    Regular = 'regular',
    Ad_Hoc = 'ad_hoc',
}

export type TChargeHead = {
    id: string;
    createdAt: string;
    name: string;
    description: string | null;
    isMandatory: boolean;
    period: EChargeHeadPeriod;
    type: EChargeHeadType;
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
        period: EChargeHeadPeriod,
        type: EChargeHeadType,
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

export enum ELedgerItemType {
    Invoice = 'invoice',
    Payment = 'payment',
    LibraryFine = 'library_fine'
}

export type TLedger_FeeInvoice = {
    id: string,
    month: EMonth,
    rcvNo: string,
    amount: number
}

export type TLedger_FeePayment = {
    id: string,
    rcvNo: string,
    amount: number
}

export type TStudentLedgerResponse = {
    data: {
        id: string,
        date: string,
        ledgerAmount: number,
        type: ELedgerItemType,
        remark: string | null,
        feeInvoice: TLedger_FeeInvoice | string | null,
        feePayment: TLedger_FeePayment | string | null,
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
    totalFeesPaid: number | null;
    ledgerItem: {
        id: string;
        ledgerAmount: number;
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
} | null;

export type TSingleInvoice_Student = {
    id: string;
    name: string;
    email: string;
    phone: string;
    rollNo: number;
    studentId: number;
    classRoomName: string;
}

export type TSingleInvoice = {
    id: string;
    totalAmount: number;
    month: number;
    invoiceDate: string,
    dueDate: string,
    invoiceNo: string,
    ledgerItem: {
        id: string;
        ledgerAmount: number;
    };
    items: {
        id: string;
        amount: number;
        discount: number;
        remark: string | null;
        chargeHead: {
            id: string;
            name: string;
        };
    }[];
    totalFeesPaid: number;
    student: TSingleInvoice_Student | string | null;
};

export type TSinglePayment = {
    id: string;
    receiptNo: string;
    amount: number;
    remark: string | null;
    createdAt: string;
    paymentMethod: EPaymentMethod;
    totalFeesPaid: number | null;
    feeInvoice: {
        id: string;
        totalAmount: number;
        month: number;
        ledgerItem: {
            id: string;
            ledgerAmount: number;
        };
        items: {
            id: string;
            amount: number;
            discount: number;
            remark: string | null;
            chargeHead: {
                id: string;
                name: string;
            };
        }[];
    };
    student: {
        id: string;
        name: string;
        email: string;
        phone: string;
        rollNo: number;
        studentId: number;
        classRoomName: string;
    } | string | null;
    bookTransactions: {
        fine: number;
        bookName: string;
        overdueDays: string;
    }[];
};

export type TStudentFeeStatistics = {
    studentLedger: {
        id: string
        amount: number
    },
    lastInvoice: {
        id: string,
        invoiceNo: string,
        totalAmount: number,
        dueDate: string
    } | null,
    lastPayment: {
        id: string,
        amount: string,
        createdAt: string
    } | null
} 