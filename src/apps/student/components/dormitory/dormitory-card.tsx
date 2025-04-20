import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Home, Users, Bed, Banknote, School, BookUser } from "lucide-react";
import { TMyDormitoryRoom } from "../../data-access/dormitory-data-access";

type Props = {
    dormitoryRoom: TMyDormitoryRoom;
};

const DormitoryCard = ({ dormitoryRoom }: Props) => {
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
                        <span className="ml-2 ">{dormitoryRoom.dormitory?.name}</span>
                    </div>
                    <div className="flex items-center">
                        <BookUser className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Room Number:</p>
                        <span className="ml-2">{dormitoryRoom.roomNumber}</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Room Type:</p>
                        <span className="ml-2">{dormitoryRoom.roomType?.name}</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Number of Beds:</p>
                        <span className="ml-2">{dormitoryRoom.noOfBeds}</span>
                    </div>
                    <div className="flex items-center">
                        <Banknote className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Cost per Bed:</p>
                        <span className="ml-2">{dormitoryRoom.costPerBed}</span>
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
                    {dormitoryRoom.students?.length > 0 ? (
                        dormitoryRoom.students.map((student) => (
                            <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted-foreground/10">
                                <div>
                                    <p className="font-medium">{student.firstName} {student.lastName}</p>
                                    <p className="text-md text-foreground">{student.classRoom.fullName}</p>
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
