import {
    Card,
    CardContent,

    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TSubjectPlan } from "@/types/subject-plan.type"
type Props = {
    subject: TSubjectPlan
}



const SubjectCard = ({ subject }: Props) => {
    return (
        <Card className="max-w-sm mx-auto border dark:text-white  border-gray-200 shadow-md rounded-lg">
            <CardHeader className="flex  flex-row justify-between items-center">
                <CardTitle className="text-lg text-gray-800  dark:text-white font-bold">{subject.subjectName}</CardTitle>
                <p className="text-gray-500 dark:text-gray-200 text-sm">Subject Code: {subject.subjectCode}</p>
            </CardHeader>
            <CardContent>
                <p className="text-gray-800 dark:text-gray-200">{subject.content}</p>
                <p className="mt-2">
                    <strong>Theory FM:</strong> {subject.theoryFM} | <strong>Practical FM:</strong> {subject.practicalFM}
                </p>
                <p className="mt-1">
                    <strong>Theory PM:</strong> {subject.theoryPM} | <strong>Practical PM:</strong> {subject.practicalPM}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-200">Taught by: {subject.teacher.firstName} {subject.teacher.lastName}</span>
                <span className="text-gray-500 dark:text-gray-200">{new Date(subject.createdAt).toLocaleDateString()}</span>
            </CardFooter>
        </Card>
    );
};

export default SubjectCard;


