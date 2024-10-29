import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Library_StudentsOverview() {
    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>Quick stats on student activities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span>Total Students:</span>
                            <span className="font-bold">10</span>
                        </div>
                        <Progress value={(0.5) * 100} />
                        <p className="text-sm text-muted-foreground mt-1">
                            4 students with issued books
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span>Most Active Course:</span>
                            <span className="font-bold">
                                Physics
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}