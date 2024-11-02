import { useParams } from "react-router-dom";
import { useGetClass } from "../actions"
import { ClassDetailsLoadingSkeleton } from "./skeletons/class-details-card-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, UserCircle2, DollarSign, MapPin } from "lucide-react"

export default function ClassDetailsCard() {
    const param = useParams();

    const { data: classRoom, isLoading } = useGetClass({ id: param.id! }); // this component is used in a dynamic route, so used not null

    if (isLoading) return <ClassDetailsLoadingSkeleton />;

    if (!classRoom) return <div>Class not found</div>;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-3xl font-bold">{classRoom.name}</CardTitle>
                    <Badge variant="secondary" className="text-lg">
                        <Users className="mr-2 h-4 w-4" />
                        {classRoom.totalStudentsCount} Students
                    </Badge>
                </div>
                <CardDescription className="text-lg mt-2">Class Overview</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Total: {classRoom.totalStudentsCount}</span>
                    </div>
                    <div className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-blue-500" />
                        <span>Male: {classRoom.totalMaleStudentsCount}</span>
                    </div>
                    <div className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-pink-500" />
                        <span>Female: {classRoom.totalFemaleStudentsCount}</span>
                    </div>
                    <div className="flex items-center">
                        <UserCircle2 className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Teacher: {classRoom.classTeacherName ?? <span className="text-muted-foreground">N/A</span>}</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Monthly Fee: {classRoom.monthlyFee}</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Monthly Tuition Fee: {classRoom.monthlyTutionFee}</span>
                    </div>
                    <div className="flex items-center md:col-span-4 col-span-2">
                        <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Classroom Location: {classRoom.location}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}