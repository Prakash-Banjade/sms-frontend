import { useGetVehicles } from "@/apps/admin/components/transportation/vehicles/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import VechicleCard from "../components/trasport/vechicle-card";
import VechicleRoutes from "../components/trasport/vechicle-route";
import { useGetRouteStops } from "@/apps/admin/components/transportation/route-stops/data-access";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleSelect from "../components/trasport/vechicle-select";

const StudentVechicleDetailsPage = () => {
    const [searchParams] = useSearchParams();
    const selectedVehicleNumber = searchParams.get("search");

    // Fetch all vehicles
    const { data, isLoading } = useGetVehicles({});

    // Filter vehicles locally if a search term is present
    const filteredVehicles = selectedVehicleNumber
        ? data?.data.filter(vehicle => vehicle.vehicleNumber === selectedVehicleNumber)
        : data?.data;

    // Fetch route data based on the selected vehicle (or all routes if no vehicle is selected)
    const { data: route, isLoading: routeLoading } = useGetRouteStops({
        queryString: createQueryString({
            search: selectedVehicleNumber, // Filter routes based on the selected vehicle
        })
    });

    // Show loading state while fetching data
    if (isLoading || routeLoading) return <div>Loading...</div>;

    // Show no vehicles available if data is empty
    if (!data || data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                No vehicle available!!
            </div>
        );
    }

    return (
        <div className="mx-auto container flex flex-col gap-6">
            <div className="flex items-center justify-between gap-8">

                <h2 className="text-lg font-semibold">Select vehicle to find its routes</h2>

                {/* Pass vehicle data to the FacetedFilter for selection */}
                <VehicleSelect data={data?.data} />
            </div>
            {/* Display vehicle and route details if available */}
            {(!filteredVehicles || filteredVehicles?.length > 0) ? (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Show loading state for vehicle card */}
                    {isLoading && <Skeleton className="w-40 h-20" />}

                    {/* Display vehicle card if filtered vehicle data exists */}
                    {!!filteredVehicles && <VechicleCard vehicle={filteredVehicles[0]} />
                    }
                    {/* Render route details if available */}
                    {route && route?.data.length > 0 ? (
                        <VechicleRoutes routes={route.data} />
                    ) : (
                        <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                            No vehicle's route available!!
                        </div>
                    )}
                </section>
            ) : (
                <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                    Please select the vehicle to see its details
                </div>
            )}
        </div>
    );
};

export default StudentVechicleDetailsPage;
