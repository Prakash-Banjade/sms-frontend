import { TMeta } from "@/types/global.type"

export type TBranch = {
    id: string,
    name: string,
    address: string,
    description: string | null,
}

export type TBranchesResponse = {
    data: TBranch[];
    meta: TMeta,
} 