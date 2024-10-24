export function getAttendanceMonth(searchParams: URLSearchParams) {

    const month = searchParams.get('month');

    if (month && !isNaN(Number(month))) {
        const monthInd = Math.abs(Number(month));

        if (monthInd > 12) return undefined;

        return monthInd;
    }

    return undefined;
}
export function getAttendanceYear(searchParams: URLSearchParams) {

    const year = searchParams.get('year');

    if (year && !isNaN(Number(year))) {
        const yearInd = Math.abs(Number(year));


        return yearInd;
    }

    return undefined;
}