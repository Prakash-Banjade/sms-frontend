import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, GraduationCap, Percent, X } from "lucide-react"

type Props = {
    percentage: number;
    gpa: number;
    failedSubjects: number;
    weakSubjects: string[];
}

export default function StudentExamReportSummary({ failedSubjects, gpa, percentage, weakSubjects }: Props) {
    return (
        <section className="@container">
            <div className="grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            GPA
                        </CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gpa}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Percentage
                        </CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{percentage}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Failed Subjects
                        </CardTitle>
                        <X className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{failedSubjects}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Weak Subjects
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {weakSubjects.length === 0 && <div className="font-medium text-muted-foreground">None</div>}
                        <div className="text-2xl font-bold">{weakSubjects.join(', ')}</div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}