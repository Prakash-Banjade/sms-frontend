import { ISO_TIME } from "@/CONSTANTS";
import { TAuthPayload } from "@/contexts/auth-provider";
import { TClassRoutine } from "@/types/class-routine.type";
import { Role } from "@/types/global.type";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { format, isAfter, isBefore } from "date-fns";
import { twMerge } from "tailwind-merge"
import { ToWords } from 'to-words';
import { compareAsc, parse } from "date-fns";
import { isEqual } from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | undefined | null, query: string) {
  if (!url) return undefined;
  return `${url}?${query}`
}

export const toWords = new ToWords();

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

export function sortClassRoutines(classRoutines: TClassRoutine[]) {
  if (!classRoutines?.length) return [];

  return classRoutines.sort((a, b) => compareAsc(
    parse(a.startTime, 'HH:mm', new Date()),
    parse(b.startTime, 'HH:mm', new Date())
  ));
}

type MilitaryTimeRange = {
  startTime: string;
  endTime: string;
}

/**
 * @param ranges - List of existing ranges
 * @param newRange - New range to check
 * @description - Check if new range overlaps with any existing range
 * @return True if new range overlaps with any existing range, False otherwise
 */

export const doesIntersect = (ranges: MilitaryTimeRange[], newRange: MilitaryTimeRange): boolean => {
  const newStart = parse(newRange.startTime, "HH:mm", new Date());
  const newEnd = parse(newRange.endTime, "HH:mm", new Date());

  return ranges.some(({ startTime, endTime }) => {
    const rangeStart = parse(startTime, "HH:mm", new Date());
    const rangeEnd = parse(endTime, "HH:mm", new Date());

    // If new range is completely outside the existing range, they are mutually exclusive.
    const isMutuallyExclusive =
      isBefore(newEnd, rangeStart) || isEqual(newEnd, rangeStart) || // newEnd is before or exactly at rangeStart
      isAfter(newStart, rangeEnd) || isEqual(newStart, rangeEnd); // newStart is after or exactly at rangeEnd

    // If it's NOT mutually exclusive, they must be overlapping.
    return !isMutuallyExclusive;
  });
}