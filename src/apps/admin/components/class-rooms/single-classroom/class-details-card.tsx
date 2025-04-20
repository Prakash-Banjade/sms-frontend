import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, UserCircle2, MapPin } from "lucide-react"
import { TSingleClassRoom } from "@/apps/admin/types/class.type";

export default function ClassDetailsCard({ classRoom }: { classRoom: TSingleClassRoom | undefined }) {
    if (!classRoom) return null;

    return (
        <Card className="@container">
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
                <div className="grid @4xl:grid-cols-4 @3xl:grid-cols-3 @2xl:grid-cols-2 gap-4">
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
                        <User className="mr-2 h-5 w-5 text-green-500" />
                        <span>Other: {classRoom.totalStudentsCount - classRoom.totalMaleStudentsCount - classRoom.totalFemaleStudentsCount}</span>
                    </div>
                    <div className="flex items-center">
                        <UserCircle2 className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Teacher: {classRoom.classTeacherName ?? <span className="text-muted-foreground">N/A</span>}</span>
                    </div>
                    <div className="flex items-center col-span-full">
                        <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Classroom Location: {
                            classRoom.location
                                ? classRoom.location
                                : <span className="text-muted-foreground">N/A</span>
                        }</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}