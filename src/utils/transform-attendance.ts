// Function to transform attendance data
export const transformAttendanceData = (data: Array<{ date: string; status: string }>) => {
    const transformedData: Record<string, string> = {};

    data.forEach((att) => {
        // Extract and format the date as YYYY-MM-DD
        const formattedDate = new Date(att.date).toISOString().split("T")[0]; // "2024-10-22"

        // Map the formatted date to the status
        transformedData[formattedDate] = att.status;
    });

    return transformedData;
};