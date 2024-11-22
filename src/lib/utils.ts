import { clsx, type ClassValue } from "clsx"
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