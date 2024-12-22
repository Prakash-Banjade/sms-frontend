import { Role, TMeta } from "@/types/global.type"

export type TUser = {
    id: string,
    profileImageUrl: string | null,
    fullName: string,
    email: string,
    role: Role,
    branchName: string
}

export type TUserResponse = {
    data: TUser[],
    meta: TMeta
}