import { useState } from "react";
import { EDaysOfWeek } from "@/types/subject-plan.type";
import { useClassRoutines } from "../../components/class-routine/action";
import ClassRoutineCard from "../../components/class-routine/class-routine-card";

const ClassRoutinePage = () => {

    const [selectedDay, setSelectedDay] = useState<EDaysOfWeek>(EDaysOfWeek.Sunday);


    const { data, isLoading } = useClassRoutines({});

    if (isLoading) return <div>Loading...</div>;

    // Filter class routines based on the selected day
    const filteredClassRoutines = selectedDay
        ? data?.data.filter((classRoutine) => true)
        : data?.data;

    return (
        <div className="flex flex-col gap-5 p-6">

            <div className="flex gap-4 items-center justify-between   border  w-full ">
                {Object.values(EDaysOfWeek).map((day) => (
                    <div
                        className={` p-4 flex-1 cursor-pointer  capitalize ${selectedDay === day ? "bg-blue-200 dark:bg-white dark:text-gray-900" : ""}`}
                        key={day}
                        onClick={() => setSelectedDay(day)}
                    >
                        <span>
                            {day}
                        </span>
                    </div>
                ))}
            </div>

            {/* Display class routines based on the selected day */}
            <div className="p-6 flex gap-2  items-center flex-wrap">
                {filteredClassRoutines?.length ? (
                    filteredClassRoutines.map((classRoutine) => (
                        <ClassRoutineCard classRoutine={classRoutine} key={classRoutine.id} />

                    ))
                ) : (
                    <div className=" text-center ">No class routines available for the selected day.</div>
                )}
            </div>
        </div>
    );
};

export default ClassRoutinePage;
