import { useGetDormitories } from "@/apps/admin/components/dormitory/actions";


const StudentDormitoryPage = () => {

    const { data, isLoading } = useGetDormitories({
    });
    if (isLoading) return <div>Loading...</div>;
    if (!data || data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                No Dormitory Infomartion available!!
            </div>
        );
    }
    return (
        <div className="mx-auto container">
            dormitory
        </div>
    )
}

export default StudentDormitoryPage
