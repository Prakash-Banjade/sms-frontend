type FormatDateOptions = {
    date: Date;
    month?: "short" | "numeric" | "2-digit" | "long" | "narrow";
    day?: "numeric" | "2-digit";
    year?: "numeric" | "2-digit";
}

/**
 * Formats a given date based on the provided day, month, and year options.
 * 
 * @param {Object} options - The options for formatting.
 * @param {Date} options.date - The date to format.
 * @param {"short" | "numeric" | "2-digit" | "long" | "narrow"} [options.month="short"] - The month format.
 * @param {"numeric" | "2-digit"} [options.day="numeric"] - The day format.
 * @param {"numeric" | "2-digit"} [options.year="numeric"] - The year format.
 * 
 * @returns {string} - The formatted date string.
 * 
 * @example
 * formatDate({ date: new Date('2024-10-19') });
 * // Output: "Oct 19, 2024"
 */

export const formatDate = (
    {
        date,
        day = "numeric",
        month = "short",
        year = "numeric"
    }: FormatDateOptions
): string => {
    return date.toLocaleDateString("en-US", {
        month,
        day,
        year,
    });
}