import { TMeta } from "../global.type";

export type TChargeHead = {
    id: string;
    createdAt: string;
    name: string;
    description: string | null;
    isMandatory: boolean
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