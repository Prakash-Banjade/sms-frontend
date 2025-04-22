import { EDayOfWeek } from "@/types/global.type";
import { addDays, format, set } from "date-fns";

type Schedule = {
    dayOfTheWeek: EDayOfWeek;
    startTime: `${string}:${string}`;
    endTime: `${string}:${string}`,
    teacher: {
        id: string,
        firstName: string,
        lastName: string
    } | null
};

export const dayOrder: Record<EDayOfWeek, number> = {
    [EDayOfWeek.SUNDAY]: 0,
    [EDayOfWeek.MONDAY]: 1,
    [EDayOfWeek.TUESDAY]: 2,
    [EDayOfWeek.WEDNESDAY]: 3,
    [EDayOfWeek.THURSDAY]: 4,
    [EDayOfWeek.FRIDAY]: 5,
    [EDayOfWeek.SATURDAY]: 6,
};

export function getNearestSchedule(schedules: Schedule[]): Schedule | null {
    const now = new Date();

    const nowDay = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let nearest: { schedule: Schedule; diffMinutes: number } | null = null;

    for (const schedule of schedules) {
        const targetDay = dayOrder[schedule.dayOfTheWeek];
        const [hours, minutes] = schedule.startTime.split(':').map(Number);
        const targetMinutes = hours * 60 + minutes;

        // Calculate day difference, taking into account wrap around (week cycle)
        let dayDiff = targetDay - nowDay;
        if (dayDiff < 0 || (dayDiff === 0 && targetMinutes <= nowMinutes)) {
            dayDiff += 7;
        }

        const totalMinutesDiff = dayDiff * 1440 + (targetMinutes - nowMinutes);

        if (!nearest || totalMinutesDiff < nearest.diffMinutes) {
            nearest = {
                schedule,
                diffMinutes: totalMinutesDiff,
            };
        }
    }

    return nearest?.schedule || null;
}

export function getFormattedUpcomingDate(schedule: ReturnType<typeof getNearestSchedule>): string {
    if (!schedule) return '';

    const now = new Date();
    const today = now.getDay();
    const targetDay = dayOrder[schedule.dayOfTheWeek];

    const [hourStr, minuteStr] = schedule.startTime.split(':');
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    let dayDiff = targetDay - today;
    if (dayDiff < 0 || (dayDiff === 0 && (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes())))) {
        dayDiff += 7;
    }

    const targetDate = addDays(now, dayDiff);
    const scheduledDate = set(targetDate, { hours, minutes, seconds: 0, milliseconds: 0 });

    return format(scheduledDate, 'EEE, dd MMM \'at\' HH:mm');
}