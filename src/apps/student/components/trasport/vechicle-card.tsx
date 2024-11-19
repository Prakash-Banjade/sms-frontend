import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TVehicle } from "@/types/vehicle.type"
import { Calendar, Clipboard, Phone, Truck, User } from "lucide-react"

type Props = {
    vehicle: TVehicle
}
const VechicleCard = ({ vehicle }: Props) => {
    return (
        <Card className="min-h-fit">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Truck className="text-muted-foreground  size-4" /> {vehicle.vehicleModel} - {vehicle.vehicleNumber}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Year Made: {vehicle.yearMade}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                    <Clipboard className="text-muted-foreground size-4" />
                    <span className="font-medium">Type:</span> {vehicle.type}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground size-4" />
                    <span className="font-medium">Capacity:</span> {vehicle.capacity}
                </div>
                {vehicle.note && (
                    <div className="flex items-center gap-2">
                        <Clipboard className="text-muted-foreground size-4" />
                        <span className="font-medium">Note:</span> {vehicle.note}
                    </div>
                )}
                {vehicle.driver ? (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold mt-4">Driver Information</h3>
                        <div className="flex items-center gap-2">
                            <User className="text-muted-foreground size-4" />
                            <span className="font-medium">Name:</span> {vehicle.driver.firstName} {vehicle.driver.lastName}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground size-4" />
                            <span className="font-medium">Phone:</span> {vehicle.driver.phone}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground mt-4">No driver assigned</p>
                )}
            </CardContent>
        </Card>
    )
}

export default VechicleCard
