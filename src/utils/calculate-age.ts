import { differenceInYears, isBefore } from "date-fns";

export function calculateExactAge(dob: Date): number {
    const today = new Date();
    let age = differenceInYears(today, dob);

    if (age === 0) return 0;

    const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (isBefore(today, thisYearBirthday)) {
        age -= 1;
    }

    return age;
}