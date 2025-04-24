import ContainerLayout from "@/components/page-layouts/container-layout";
import { useGetMyDormitoryRoom } from "../data-access/dormitory-data-access";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Home, Users, Bed, Banknote, School, BookUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function MyDormitoryPage() {

    return (
        <ContainerLayout
            title="My Dormitory"
            description="Your dormitory details."
        >
            <section className="@container">
                <DormitoryDetailsView />
            </section>
        </ContainerLayout>
    )
};

function DormitoryDetailsView() {
    const { data, isLoading } = useGetMyDormitoryRoom({});

    if (isLoading) return <div>Loading...</div>;

    if (!data) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                You don't share a dormitory with anyone.
            </div>
        );
    }

    return (
        <div className="grid gap-6 @3xl:grid-cols-2">
            {/* Dormitory Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Dormitory Details</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="py-6 space-y-4">
                    <div className="flex items-center">
                        <School className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Dormitory Name:</p>
                        <span className="ml-2 ">{data.dormitory?.name}</span>
                    </div>
                    <div className="flex items-center">
                        <BookUser className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Room Number:</p>
                        <span className="ml-2">{data.roomNumber}</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Room Type:</p>
                        <span className="ml-2">{data.roomType?.name}</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Number of Beds:</p>
                        <span className="ml-2">{data.noOfBeds}</span>
                    </div>
                    <div className="flex items-center">
                        <Banknote className="mr-2 text-muted-foreground" />
                        <p className="font-medium">Cost per Bed:</p>
                        <span className="ml-2">Rs. {data.costPerBed}</span>
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
                    {data.students?.length > 0 ? (
                        data.students.map((student) => (
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
    )
}