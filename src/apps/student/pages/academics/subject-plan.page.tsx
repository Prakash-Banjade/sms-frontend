
import { EDaysOfWeek } from "@/types/subject-plan.type";
import { useSubjects } from "../../components/subjects/action";
import SubjectCard from "../../components/subjects/subject-card";


const SubjectPlanPage = () => {


    const { data, isLoading } = useSubjects({
        queryString: `classRoomId=5d666052-8f0a-4c87-b9a1-b151eef930e9`,

    });

    if (isLoading) return <div>Loading...</div>;

    return (

        <div className="flex flex-col gap-5 p-6">

            <div className="flex gap-4 items-center justify-between divide-x   border rounded-lg ">
                {
                    Object.values(EDaysOfWeek).map((day) => (
                        <span className="p-4" key={day}>{day}</span>
                    ))
                }
            </div>
            <div className="p-6 flex gap-5 flex-col">

                {
                    data?.data.map((subject) => (
                        <SubjectCard subject={subject} key={subject.id} />
                    ))
                }
            </div>
        </div>
    )
}

export default SubjectPlanPage