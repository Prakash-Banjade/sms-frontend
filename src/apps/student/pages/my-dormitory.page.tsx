import ContainerLayout from "@/components/page-layouts/container-layout";
import { useGetMyDormitoryRoom } from "../data-access/dormitory-data-access";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Bed, Banknote, School, BookUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProfileAvatar } from "@/components/ui/avatar";
import { cn, getImageUrl } from "@/lib/utils";

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
            <Card className="border rounded-lg shadow-xs">
                <CardHeader>
                    <CardTitle>Your Roommates</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="py-6 flex gap-6 flex-wrap">
                    {data.students?.length > 0 ? (
                        data.students.map((student) => (
                            <div key={student.id} className="flex items-center gap-3 p-4 rounded-lg bg-secondary grow">
                                <ProfileAvatar
                                    name={student.firstName + ' ' + student.lastName}
                                    src={getImageUrl(student.account?.profileImage?.url, "w=64")}
                                    className={cn("size-16", !student.account?.profileImage?.url && "border-primary border")}
                                />
                                <div>
                                    <p className="font-medium text-lg">{student.firstName} {student.lastName}</p>
                                    <p className="text-sm">Class: <span className="text-muted-foreground">{student.classRoom.fullName}</span></p>
                                    <p className="text-sm">Phone: <span className="text-muted-foreground">{student.phone}</span></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No roommates</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}