import {
    Card,

    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TClassRoutine } from "@/types/class-routine.type";
import { Link } from "react-router-dom";


type Props = {
    classRoutine: TClassRoutine
}



const ClassRoutineCard = ({ classRoutine }: Props) => {
    return (
        <Card className="max-w-sm mx-auto border dark:text-white  border-gray-200 shadow-md rounded-lg">
            <CardHeader className="flex  flex-row justify-between items-center">

                <Link to='chapters'>
                    <CardTitle className="text-lg text-gray-800  dark:text-white font-bold cursor-pointer">{classRoutine?.subject?.subjectName}</CardTitle>
                </Link>
                <p className="text-gray-500 dark:text-gray-200  flex gap-2 items-center ">
                    {` ${classRoutine.startTime}
                    -
                        ${classRoutine.endTime
                        }`}

                </p>
            </CardHeader>

            <CardFooter className="flex text-md gap-5 items-center">
                <span className="text-gray-600 dark:text-gray-200">Taught by : {classRoutine?.subject?.teacher.firstName} {classRoutine?.subject?.teacher.lastName}</span>
                <span className="text-gray-500 dark:text-gray-200">{new Date(classRoutine.createdAt).toLocaleDateString()}</span>
            </CardFooter>
        </Card>
    );
};

export default ClassRoutineCard;


