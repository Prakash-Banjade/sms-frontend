import { useGetVehicles } from "@/apps/admin/components/transportation/vehicles/data-access";
import { createQueryString } from "@/utils/create-query-string";
import VechicleCard from "../components/trasport/vechicle-card";

const StudentVechicleDetailsPage = () => {
    const { data, isLoading } = useGetVehicles({
        queryString: createQueryString({
        }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (!data) return <div>No vechicle found</div>
    else if (data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                No vechicle available!!
            </div>
        );
    }
    return (
        <div className="conatiner mx-auto">

            {
                data?.data.map((vechicle) => (
                    <VechicleCard vechicle={vechicle} key={vechicle.id} />
                ))
            }
        </div>
    )
}

export default StudentVechicleDetailsPage
