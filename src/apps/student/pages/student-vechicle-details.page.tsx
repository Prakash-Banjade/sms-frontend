import { useGetVehicles } from "@/apps/admin/components/transportation/vehicles/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import VechicleCard from "../components/trasport/vechicle-card";
import VechicleRoutes from "../components/trasport/vechicle-route";
import { useGetRouteStops } from "@/apps/admin/components/transportation/route-stops/data-access";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleSelect from "../components/trasport/vechicle-select";
import { useState } from "react";
import { QueryKey } from "@/react-query/queryKeys";

const StudentVechicleDetailsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<string | null>(searchParams.get("search") || null);
    const { data, isLoading } = useGetVehicles({});


    // Filtered vehicles based on selected vehicle number
    const filteredVehicles = selectedVehicleNumber
        ? data?.data.filter(vehicle => vehicle.vehicleNumber === selectedVehicleNumber)
        : data?.data;

    // Fetch route data based on the selected vehicle
    const { data: route, isLoading: routeLoading } = useGetRouteStops({
        queryString: createQueryString({ search: selectedVehicleNumber || '' }),
        options: {
            queryKey: [QueryKey.ROUTE_STOPS, selectedVehicleNumber],
            enabled: !!selectedVehicleNumber // Only fetch when a vehicle is selected
        }
    });

    if (!data) return <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">No vehicle available</div>;

    // Handle vehicle selection change
    const handleVehicleSelect = (vehicleNumber: string) => {
        setSelectedVehicleNumber(vehicleNumber);
        setSearchParams({ search: vehicleNumber });
    };

    return (
        <div className="mx-auto container flex flex-col gap-6">
            <div className="flex items-center justify-between gap-8">
                <h2 className="text-lg font-semibold">Select vehicle to find its routes</h2>
                <VehicleSelect
                    data={data?.data}
                    placeholder="Select Vehicle"
                    label="Vehicles"
                    onSelectChange={handleVehicleSelect}
                />
            </div>

            {/* Display message if no vehicle is selected */}
            {!selectedVehicleNumber && (
                <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                    Please select a vehicle to see its details and route.
                </div>
            )}

            {/* Show vehicle and route details when a vehicle is selected */}
            {selectedVehicleNumber && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {isLoading ? (
                        <Skeleton className="w-40 h-20" />
                    ) : (
                        filteredVehicles && filteredVehicles.length > 0 && (
                            <VechicleCard vehicle={filteredVehicles[0]} />
                        )
                    )}
                    {routeLoading ? (
                        <Skeleton className="w-full h-40 rounded-lg" />
                    ) : (
                        route && route.data.length > 0 ? (
                            <VechicleRoutes routes={route.data} />
                        ) : (
                            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                                No route available for the selected vehicle.
                            </div>
                        )
                    )}
                </section>
            )}
        </div>
    );
};

export default StudentVechicleDetailsPage;
