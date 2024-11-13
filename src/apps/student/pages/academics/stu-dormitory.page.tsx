import { useGetDormitories } from "@/apps/admin/components/dormitory/actions";
import DormitoryCard from "../../components/dormitory/dormitory-card";


const StudentDormitoryPage = () => {

    const { data, isLoading } = useGetDormitories({
    });
    if (isLoading) return <div>Loading...</div>;
    // if (!data || data?.data.length === 0) {
    //     return (
    //         <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
    //             No Dormitory Infomartion available!!
    //         </div>
    //     );
    // }
    return (
        <div className="container mx-auto flex flex-col gap-6">
            <h2 className="text-lg font-semibold">My Dormitory Details</h2>
            <DormitoryCard />
        </div>
    )
}

export default StudentDormitoryPage
