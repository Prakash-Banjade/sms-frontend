import DormitoryCard from "../../components/dormitory/dormitory-card";
import { useGetMyDormitoryRoom } from "../../data-access/dormitory-data-access";

const StudentDormitoryPage = () => {
    const { data, isLoading } = useGetMyDormitoryRoom({});

    if (isLoading) return <div>Loading...</div>;

    if (!data) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                You don't share a dormitory with anyone.
            </div>
        );
    }

    return (
        <div className="container mx-auto flex flex-col gap-6">
            <h2 className="text-lg font-semibold">My Dormitory Details</h2>
            <DormitoryCard dormitoryRoom={data} />
        </div>
    )
}

export default StudentDormitoryPage;
