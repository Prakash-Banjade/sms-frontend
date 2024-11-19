import { useGetStudent_Me } from "../components/dashboard/data-access";
import StudentProfile from "../components/dashboard/student-profile";
import { Skeleton } from "@/components/ui/skeleton";


const StudentDashboardPage = () => {

    const { data: student, isLoading } = useGetStudent_Me({});
    if (!student) return <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">No student details available</div>

    return (
        <div className="container mx-auto ">
            <h1 className="text-lg font-semibold mb-6">Student Profile</h1>
            {
                isLoading ? <Skeleton className="w-full h-40" /> : <StudentProfile student={student} />
            }

        </div>
    )
}

export default StudentDashboardPage

