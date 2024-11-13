
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TRouteStop } from "@/types/route-stop.type"
import { Clock, MapPin, MapPinHouse } from "lucide-react"

type Props = {
    routes: TRouteStop[]
}
const VechicleRoutes = ({ routes }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bus Route</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Stop Name</TableHead>
                            <TableHead>Stop Location</TableHead>
                            <TableHead>PickUp Time</TableHead>
                            <TableHead> DropOff Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routes.map((stop, index) => (
                            <TableRow key={index}>
                                <TableCell className="flex items-center">
                                    <MapPinHouse className="mr-2 h-4 w-4" />
                                    {stop.name}
                                </TableCell>
                                <TableCell className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {stop.location}
                                </TableCell>
                                <TableCell>
                                    <Clock className="mr-2 h-4 w-4 inline" />
                                    {stop.pickUpTime}
                                </TableCell>
                                <TableCell>
                                    <Clock className="mr-2 h-4 w-4 inline" />
                                    {stop.dropOffTime}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default VechicleRoutes
