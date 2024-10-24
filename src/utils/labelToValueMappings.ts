/**
|--------------------------------------------------
| These are the objects to used in select fields with capitalized labels and required value.
| This can be done with already existing enum types but we have not used capitalized labels and shadcn select don't make capitalize the selected ones.
|--------------------------------------------------
*/

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