import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TRouteStop } from "@/apps/admin/types/route-stop.type";

type Props = {
    routes: TRouteStop[];
};

const VehicleRoutes = ({ routes }: Props) => {
    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Bus Route</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Stop Name</TableHead>
                            <TableHead className="text-center">Stop Location</TableHead>
                            <TableHead className="text-center">PickUp Time</TableHead>
                            <TableHead className="text-center">DropOff Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routes.map((stop, index) => (
                            <TableRow key={index} className="text-md">
                                {/* Stop Name */}
                                <TableCell className="text-center">
                                    {stop.name}
                                </TableCell>

                                {/* Stop Location */}
                                <TableCell className="text-center">
                                    {stop.location}
                                </TableCell>

                                {/* Pickup Time */}
                                <TableCell className="text-center">
                                    {stop.pickUpTime || "N/A"}
                                </TableCell>

                                {/* Dropoff Time */}
                                <TableCell className="text-center">
                                    {stop.dropOffTime || "N/A"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default VehicleRoutes;
