import { ISO_TIME } from "@/CONSTANTS";
import { TAuthPayload } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { add, format } from "date-fns";
import { twMerge } from "tailwind-merge"
import { ToWords } from 'to-words';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | undefined | null, query: string) {
  if (!url) return undefined;
  return `${url}?${query}`
}

export const toWords = new ToWords();

export const getCreatedAt = (date: Date): Date => {
  const timeToAdd = { hours: 5, minutes: 45 };

  const newDate = add(date, timeToAdd)

  return newDate;
}

export function startOfDayString(date: Date) {
  return format(date, 'yyyy-MM-dd') + ISO_TIME;
}

export function isAdmin(payload: TAuthPayload | null): boolean {
  return ([Role.ADMIN, Role.SUPER_ADMIN] as Role[]).includes(payload?.role as Role);
}

export function getErrMsg(error: unknown): string | null {
  if (error instanceof AxiosError) {

    const err = error.response?.data?.message;

    if (err instanceof Object && 'message' in err) {
      return err.message;
    } else if (typeof err === 'string') {
      return err;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function calculateRatios(
  totalStudents: number,
  totalBoys: number,
  totalGirls: number,
  totalOthers: number
) {
  if (totalStudents === 0) {
    // If totalStudents is 0, return zeros for all ratios to avoid division by zero
    return [0, 0, 0];
  }

  return [
    +(totalBoys / totalStudents).toFixed(2),
    +(totalGirls / totalStudents).toFixed(2),
    +(totalOthers / totalStudents).toFixed(2),
  ];
}
