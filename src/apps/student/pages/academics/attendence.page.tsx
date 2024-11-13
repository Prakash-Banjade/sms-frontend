import { useRef } from "react";
import { useAttendenceCounts, useAttendences } from "../../components/attendence/action";
import AttendenceCalendar from "../../components/attendence/attendence-calendar";
import { useSearchParams } from "react-router-dom";
import { getAttendanceMonth } from "@/utils/getAttendanceMonth";
import TotalAttendence from "../../components/attendence/total-attendence";

const StudentAttendenceListPage = () => {
    const [searchParams] = useSearchParams();
    const monthInd = useRef(getAttendanceMonth(searchParams));

    const { data, isLoading } = useAttendences({
        queryString: `take=32${!!monthInd?.current ? `&month=${monthInd.current}` : ''}`
    });
    const { data: monthAttendenceCount, isLoading: countMonthLoading } = useAttendenceCounts({
        queryString: searchParams.toString(),
    });


    if (isLoading) return <div>Loading..</div>;
    if (!data) return <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
        No attendance available
    </div>;

    return (
        <div className=" flex flex-col lg:flex-row gap-10 justify-between p-6">

            <AttendenceCalendar attendanceData={data} />
            <section className="flex-1 space-y-6">
                {
                    countMonthLoading ? <div>Loading..</div> :
                        <section>
                            {monthAttendenceCount && <TotalAttendence attendenceCount={monthAttendenceCount} />}
                        </section>
                }

            </section>
        </div>
    );
};

export default StudentAttendenceListPage;
