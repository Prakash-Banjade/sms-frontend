import { TAuthPayload } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";

export function isAdmin(payload: TAuthPayload | null): Boolean {
    return payload?.role === Role.ADMIN || payload?.role === Role.SUPER_ADMIN;
}