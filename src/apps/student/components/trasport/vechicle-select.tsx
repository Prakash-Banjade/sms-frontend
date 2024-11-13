import { TVehicle } from "@/types/vehicle.type";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface VehicleSelectProps {
    data: TVehicle[];
}

const VehicleSelect = ({ data }: VehicleSelectProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize the selected vehicle number from URL, if it exists
    const initialVehicleNumber = searchParams.get("search") || '';
    const [selectedVehicle, setSelectedVehicle] = useState<string>(initialVehicleNumber);

    // Update the URL when the selected vehicle changes
    useEffect(() => {
        if (selectedVehicle) {
            setSearchParams({ search: selectedVehicle });
        }
    }, [selectedVehicle, setSearchParams]);

    // Handle select change to update the selected vehicle and URL
    const handleSelectChange = (value: string) => {
        setSelectedVehicle(value); // Set the selected vehicle number
    };

    return (
        <div>
            <Select value={selectedVehicle} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Vehicles</SelectLabel>
                        {data.map((vehicle) => (
                            <SelectItem key={vehicle.vehicleNumber} value={vehicle.vehicleNumber}>
                                {vehicle.vehicleNumber}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default VehicleSelect;
