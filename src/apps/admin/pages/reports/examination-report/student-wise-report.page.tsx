import { useGetExamReportByStudent } from "@/apps/admin/components/examination/data-access";
import GetExamReportByStudentForm from "@/apps/admin/components/report/examination-report/get-exam-report-by-student-form";
import StudentExamReportSummary from "@/apps/admin/components/report/examination-report/student-exam-report-summary";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { ProfileAvatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import { StudentDetailedMarksTable } from "@/apps/admin/components/report/examination-report/student-detailed-marks-table";
import ReportCardPrintBtn from "@/apps/admin/components/report/examination-report/report-card-print-preview";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;


export default function ExaminationReport_StudentWise() {

    return (
        <ContainerLayout
            title="Examination Report"
        >
            <GetExamReportByStudentForm />
            <ReportSection />
        </ContainerLayout>
    )
}

function ReportSection() {
    const { searchParams } = useCustomSearchParams();
    
    const { examTypeId, studentId } = useMemo(() => {
        return {
            studentId: searchParams.get('studentId'),
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchParams]);

    const { data, isLoading } = useGetExamReportByStudent({
        queryString: searchParams.toString(),
        options: { enabled: !!examTypeId && !!studentId }
    });

    const barGraphData = useMemo(() => {
        if (!data) return [];

        return data.examReport?.examSubjects.map(subject => ({
            subjectName: subject.subject.subjectName,
            percentage: subject.examReports[0].percentage,
        }))
    }, [data]);

    if (isLoading) return <div className="mt-20 text-center">Loading...</div>;

    if (!examTypeId || !studentId) return <div className="mt-20 text-center">Enter student ID and select exam type to view report</div>;

    if (!data) return <div className="mt-20 text-center">No data found</div>;

    return (
        <section className="p-6 rounded-lg border space-y-6">
            {/* student details */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-shrink-0">
                            <ProfileAvatar
                                src={getImageUrl(data.student?.profileImageUrl, 'w=100')}
                                name={data.student?.firstName + " " + data.student?.lastName}
                                className="w-24 h-24 rounded-full"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-2xl font-bold">{data.student?.firstName} {data.student?.lastName}</h2>
                            <div className="flex gap-8">
                                <section>
                                    <p className="text-muted-foreground">Roll No: {data.student?.rollNo}</p>
                                    <p className="text-muted-foreground">
                                        {
                                            data.student?.parentClassName
                                                ? `${data.student?.parentClassName} - ${data.student?.classRoomName}`
                                                : data.student?.classRoomName
                                        }
                                    </p>
                                </section>
                                <section>
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{data.student?.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{data.student?.email}</span>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* report summary */}
            <StudentExamReportSummary
                failedSubjects={data.failedSubjectsCount}
                gpa={data.gpa}
                percentage={data.percentage}
                weakestSubject={data.weakestSubject}
            />

            {/* bar chart: subject wise performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Subject-wise Performance</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[400px] w-full">
                        <BarChart data={barGraphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subjectName" />
                            <YAxis domain={[0, 100]} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="percentage" fill="hsl(var(--info))" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* detailed marks */}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-10">
                    <CardTitle>Detailed Marks</CardTitle>
                    <ReportCardPrintBtn data={data} />
                </CardHeader>
                <CardContent>
                    <StudentDetailedMarksTable examReport={data.examReport} />
                </CardContent>
            </Card>

        </section>
    )
}
