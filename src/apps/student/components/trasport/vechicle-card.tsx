import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TVehicle } from "@/types/vehicle.type"
import { Calendar, Clipboard, Phone, Truck, User } from "lucide-react"

type Props = {
    vechicle: TVehicle
}
const VechicleCard = ({ vechicle }: Props) => {
    return (
        <Card className="w-full max-w-md mx-auto border shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Truck className="text-muted-foreground" /> {vechicle.vehicleModel} - {vechicle.vehicleNumber}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Year Made: {vechicle.yearMade}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                    <Clipboard className="text-muted-foreground" />
                    <span className="font-medium">Type:</span> {vechicle.type}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground" />
                    <span className="font-medium">Capacity:</span> {vechicle.capacity}
                </div>
                {vechicle.note && (
                    <div className="flex items-center gap-2">
                        <Clipboard className="text-muted-foreground" />
                        <span className="font-medium">Note:</span> {vechicle.note}
                    </div>
                )}
                {vechicle.driver ? (
                    <div>
                        <h3 className="text-lg font-semibold mt-4">Driver Information</h3>
                        <div className="flex items-center gap-2">
                            <User className="text-muted-foreground" />
                            <span className="font-medium">Name:</span> {vechicle.driver.firstName} {vechicle.driver.lastName}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground" />
                            <span className="font-medium">Phone:</span> {vechicle.driver.phone}
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
