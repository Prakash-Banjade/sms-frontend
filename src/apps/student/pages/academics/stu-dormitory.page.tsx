import { useGetMyDormitory } from "../../components/dormitory/data-access";
import DormitoryCard from "../../components/dormitory/dormitory-card";


const StudentDormitoryPage = () => {
    const { data, isLoading } = useGetMyDormitory({});

    if (isLoading) return <div>Loading...</div>;

    if (!data) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                You have not joined any dormitory yet.
            </div>
        );
    }

    return (
        <div className="container mx-auto flex flex-col gap-6">
            <h2 className="text-lg font-semibold">My Dormitory Details</h2>
            <DormitoryCard dormitory={data} />
        </div>
    )
}

export default StudentDormitoryPage
