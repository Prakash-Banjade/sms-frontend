/**
|--------------------------------------------------
| These are the objects to used in select fields with capitalized labels and required value.
| This can be done with already existing enum types but we have not used capitalized labels and shadcn select don't make capitalize the selected ones.
|--------------------------------------------------
*/

import { EDegreeLevel } from "@/types/global.type"

// label: value
export const DayOfWeekMappings = {
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
    Sunday: "sunday",
}

export const GenderMappings = {
    Male: "male",
    Female: "female",
    Other: "other",
}

export const RoutineTypeMappings = {
    Class: "class",
    Break: "break",
}

export const DormitoryTypeMappings = {
    Boys: "boys",
    Girls: "girls",
    Both: "both",
}

export const MaritalStatusMappings = {
    Single: "single",
    Married: "married",
    Widowed: "widowed",
    Divorced: "divorced",
}

export const BloodGroupMappings = {
    "A+": "A+",
    "A-": "A-",
    "B+": "B+",
    "B-": "B-",
    "O+": "O+",
    "O-": "O-",
    "AB+": "AB+",
    "AB-": "AB-",
}

export const ReligionMappings = {
    Islam: "islam",
    Hindu: "hinduism",
    Sik: "sikhism",
    Buddhism: "buddhism",
    Christianity: "christianity",
    Protestantism: "protestantism",
    Other: "other",
}

export const GuardianRelationMappings = {
    Father: "father",
    Mother: "mother",
    Sister: "sister",
    Brother: "brother",
    Guardian: "guardian",
    Other: "other",
}

export const StaffTypeMappings = {
    Driver: "driver",
    Labor: "labor",
    Helper: "helper",
    Peon: "peon",
    Guard: "guard",
    Librarian: "librarian",
    Receptionist: "receptionist",
    Accountant: "accountant",
    Other: "other",
}

export const AttendanceStatusMappings = {
    Present: "present",
    Absent: "absent",
    Late: "late",
    Leave: "leave",
}

// value: label
export const EDegreeLevelMappings: Record<EDegreeLevel, string> = {
    [EDegreeLevel.Basic_School]: "Basic School",
    [EDegreeLevel.Plus_Two]: "+2",
    [EDegreeLevel.Diploma]: "Diploma",
    [EDegreeLevel.Bachelor]: "Bachelor",
    [EDegreeLevel.Master]: "Master",
}