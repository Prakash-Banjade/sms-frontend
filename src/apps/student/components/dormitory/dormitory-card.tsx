import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Home, Users, Bed, Banknote, School, BookUser } from "lucide-react";
import { TMyDormitory } from "./data-access";

type Props = {
    dormitory: TMyDormitory;
};

const DormitoryCard = ({ dormitory }: Props) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 p-4">
            {/* Dormitory Details Card */}
            <Card className="border rounded-lg shadow-sm">
                <CardHeader className="border-b pb-2">
                    <CardTitle className="flex items-center text-lg font-semibold">
                        <Home className="mr-2 text-muted-foreground" />
                        Dormitory Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 py-4 ">
                    <div className="flex items-center">
                        <School className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Dormitory Name:</p>
                        <span className="ml-2 ">{dormitory.dormitoryName}</span>
                    </div>
                    <div className="flex items-center">
                        <BookUser className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Room Number:</p>
                        <span className="ml-2">{dormitory.roomNumber}</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Room Type:</p>
                        <span className="ml-2">{dormitory.roomTypeName}</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Number of Beds:</p>
                        <span className="ml-2">{dormitory.noOfBeds}</span>
                    </div>
                    <div className="flex items-center">
                        <Banknote className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Cost per Bed:</p>
                        <span className="ml-2">{dormitory.costPerBed}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Roommates Card */}
            <Card className="border rounded-lg shadow-sm">
                <CardHeader className="border-b pb-2">
                    <CardTitle className="flex items-center text-lg font-semibold">
                        <Users className="mr-2 text-muted-foreground" />
                        Your Roommates
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-4">
                    {dormitory.roomMates.length > 0 ? (
                        dormitory.roomMates.map((roommate) => (
                            <div key={roommate.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted-foreground/10">
                                {/* Avatar with initials */}
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted-foreground text-foreground font-semibold">
                                    {roommate.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                {/* Roommate details */}
                                <div>
                                    <p className="font-medium">{roommate.name}</p>
                                    <p className="text-md text-foreground">{roommate.classroomName}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No roommates assigned</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DormitoryCard;
