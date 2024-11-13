import { useGetVehicles } from "@/apps/admin/components/transportation/vehicles/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { useSearchParams } from "react-router-dom";
import VechicleCard from "../components/trasport/vechicle-card";
import VechicleRoutes from "../components/trasport/vechicle-route";
import { useGetRouteStops } from "@/apps/admin/components/transportation/route-stops/data-access";


const StudentVechicleDetailsPage = () => {
    const [searchParams] = useSearchParams()
    const { data, isLoading } = useGetVehicles({
        // queryString: createQueryString({
        //     search: searchParams.get("search")
        // }),
    });
    const { data: route, isLoading: routeLoading } = useGetRouteStops({
        queryString: createQueryString({

            search: searchParams.get('search'),

        })
    })

    if (isLoading || routeLoading) return <div>Loading...</div>;
    if (!data || data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                No vechicle available!!
            </div>
        );

    } 
    return (
        <div className="mx-auto container flex flex-col gap-6">

            <h2 className="text-lg font-semibold">Select vechicle to find its routes</h2>
            <FacetedFilter title="Available Vechicle" searchKey="search" options={data?.data.map(vechicle => ({
                label: vechicle.vehicleNumber,
                value: vechicle.vehicleNumber
            }))} />
            <section className=" grid grid-cols-1 lg:grid-cols-2 gap-10">
                <VechicleCard vechicle={data?.data[0]} />
                {
                    (!route || route?.data.length === 0) ? (
                        <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                            No vechicle's route  available!!
                        </div>
                    ) : <VechicleRoutes routes={route.data} />
                }
            </section>
        </div>
    )
}

export default StudentVechicleDetailsPage
