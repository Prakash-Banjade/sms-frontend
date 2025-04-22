import ExamReportSearch from "../../components/examination/exam-report-search";
import { useGetExamReportByStudent } from "@/apps/admin/components/examination/data-access";
import StudentExamReportSummary from "@/apps/admin/components/report/examination-report/student-exam-report-summary";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ProfileAvatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Bell, ClipboardList, Clock, Mail, Phone } from "lucide-react";
import { StudentDetailedMarksTable } from "@/apps/admin/components/report/examination-report/student-detailed-marks-table";
import ReportCardPrintBtn from "@/apps/admin/components/report/examination-report/report-card-print-preview";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { AxiosError } from "axios";
import { AuthMessage } from "@/CONSTANTS";

export default function StudentExamReportPage() {
    return (
        <ContainerLayout
            title="Examination Report"
            description="Get your current and historical examination reports"
        >
            <ExamReportSearch />
            <ReportSection />
        </ContainerLayout>
    )
}

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

function ReportSection() {
    const { searchParams } = useCustomSearchParams();

    const { examTypeId } = useMemo(() => {
        return {
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchParams]);

    const { data, isLoading, error } = useGetExamReportByStudent({
        queryString: searchParams.toString(),
        options: { enabled: !!examTypeId }
    });

    const barGraphData = useMemo(() => {
        if (!data) return [];

        return data.examReport?.examSubjects.map(subject => ({
            subjectName: subject.subject?.subjectName,
            percentage: subject.examReports[0]?.percentage,
        }))
    }, [data]);

    if (isLoading) return <div className="mt-20 text-center">Loading...</div>;

    if (!examTypeId) return <div className="mt-20 text-center">Select exam type to view report</div>;

    if (error instanceof AxiosError && error.response?.data?.message?.message === AuthMessage.REPORT_NOT_PUBLISHED) return <ReportNotPublishedView />;

    if (!data) return <div className="mt-20 text-center">No data found</div>;

    return (
        <section className="p-6 rounded-lg border space-y-6">
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
                failedSubjects={data?.failedSubjectsCount}
                gpa={data?.gpa}
                percentage={data?.percentage}
                weakSubjects={data?.weakSubjects}
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

function ReportNotPublishedView() {
    return (
        <Card className="w-full max-w-md mx-auto border-none mt-10">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-amber-100">
                        <ClipboardList className="w-10 h-10 text-amber-600" />
                    </div>
                </div>
                <CardTitle className="text-2xl">Report Not Published Yet</CardTitle>
                <CardDescription>Your exam report is still being processed and will be available soon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Expected Publication</p>
                            <p className="text-sm text-muted-foreground">
                                Reports are typically published within 10-20 days after the exam completion.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Get Notified</p>
                            <p className="text-sm text-muted-foreground">
                                You will receive an email notification when your report is ready to view.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}