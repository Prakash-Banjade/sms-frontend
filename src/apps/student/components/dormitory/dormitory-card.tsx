import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

interface DormitoryInfo {
    name: string
    roomNumber: string
    roomType: string
    capacity: number
    amenities: string[]
    // roommates: Roommate[]
}

// In a real application, this data would be fetched from an API
const dormitoryInfo: DormitoryInfo = {
    name: "Sunset Hall",
    roomNumber: "304",
    roomType: "Double",
    capacity: 200,
    amenities: ["Wi-Fi", "Cafeteria", "Gym"],
    // roommates: [
    //     { id: "1", name: "Jane Smith", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    //     { id: "2", name: "Alex Johnson", avatarUrl: "https://i.pravatar.cc/150?img=2" }
    // ]
}

const DormitoryCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Home className="mr-2" />
                    Dormitory Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-semibold mb-2">{dormitoryInfo.name}</p>
                <p><strong>Room Number:</strong> {dormitoryInfo.roomNumber}</p>
                <p><strong>Room Type:</strong> {dormitoryInfo.roomType}</p>
                <p><strong>Dormitory Capacity:</strong> {dormitoryInfo.capacity} students</p>
                <p><strong>Warden Name:</strong> Sinha Pandey </p>
                <p><strong>Warden's Contact Number:</strong> 089183827 </p>
                {/* <div className="mt-4">
                    <p className="font-semibold mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                        {dormitoryInfo.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center">
                                {amenity === "Wi-Fi" && <Wifi className="mr-1 h-3 w-3" />}
                                {amenity === "Cafeteria" && <Coffee className="mr-1 h-3 w-3" />}
                                {amenity === "Gym" && <Dumbbell className="mr-1 h-3 w-3" />}
                                {amenity}
                            </Badge>
                        ))}
                    </div>
                </div> */}
            </CardContent>
        </Card>
    )
}

export default DormitoryCard
