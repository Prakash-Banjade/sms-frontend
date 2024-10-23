import { useRef } from "react";
import { useAttendences } from "../../components/attendence/action";
import AttendenceCalendar from "../../components/attendence/attendence-calendar";
import { useSearchParams } from "react-router-dom";
import { getAttendanceMonth } from "@/utils/getAttendanceMonth";
import TotalAttendence from "../../components/attendence/total-attendence";

const StudentAttendenceListPage = () => {
    const [searchParams] = useSearchParams();

    const monthInd = useRef(getAttendanceMonth(searchParams));
    console.log(monthInd.current)

    const { data, isLoading } = useAttendences({
        queryString: `take=32${!!monthInd?.current ? `&month=${monthInd.current}` : ''}`
    });

    if (isLoading) return <div>Loading..</div>;
    if (!data) return <div className="flex justify-center items-center h-[50vh] text-muted-foreground">
        No attendance available
    </div>;

    return (
        <div className="flex gap-10 justify-between p-6">

            <AttendenceCalendar attendanceData={data} />
            <TotalAttendence attendanceData={data.data} />
        </div>
    );
};

export default StudentAttendenceListPage;
