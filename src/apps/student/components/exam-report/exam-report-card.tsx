import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, AlertTriangle, TrendingDown } from 'lucide-react'
import { TExamReportByStudent } from "@/types/examination.type"
import { getImageUrl } from "@/lib/utils"
import { ProfileAvatar } from "@/components/ui/avatar"
import ReportCardPrintBtn from "@/apps/admin/components/report/examination-report/report-card-print-preview"
import { StudentDetailedMarksTable } from "@/apps/admin/components/report/examination-report/student-detailed-marks-table"

export default function ExamReportCard({ report }: { report: TExamReportByStudent }) {
    const { student, examReport, percentage, gpa, grade, failedSubjectsCount, weakestSubject } = report

    return (
        <Card className="w-full  mx-auto">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-4">

                <ProfileAvatar
                    src={getImageUrl(student.profileImageUrl, 'w=100')}
                    name={student.firstName + " " + student.lastName}
                    className="w-24 h-24 rounded-full"
                />
                <div className="text-center space-y-2 sm:text-left">
                    <CardTitle className="text-2xl">{student.firstName} {student.lastName}</CardTitle>
                    <p className="text-muted-foreground">Roll No: {student.rollNo}</p>
                    <p className="text-muted-foreground">{student.classRoomName}</p>
                </div>
            </CardHeader>
            <CardContent>
                {examReport ? (
                    <>
                        <div className="grid gap-4 mb-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{examReport.examType.name}</h3>
                                <Badge variant={grade === 'F' ? 'destructive' : 'success'}>{grade}</Badge>
                            </div>
                            <Progress value={percentage} className="w-full"

                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Percentage: {percentage.toFixed(2)}%</span>
                                <span>GPA: {gpa.toFixed(2)}</span>
                            </div>
                        </div>



                        <div className="mt-6 space-y-2">
                            {failedSubjectsCount > 0 && (
                                <div className="flex items-center text-destructive">
                                    <AlertTriangle className="mr-2" />
                                    <span>Failed Subjects: {failedSubjectsCount}</span>
                                </div>
                            )}
                            <div className="flex items-center text-red-600">
                                <TrendingDown className="mr-2" />
                                <span>Weakest Subject: {weakestSubject}</span>
                            </div>
                        </div>
                        {/* detailed marks */}

                        <Card className="mt-8">
                            <CardHeader className="flex flex-row items-center justify-between gap-10">
                                <CardTitle>Detailed Marks</CardTitle>
                                <ReportCardPrintBtn data={report} />
                            </CardHeader>
                            <CardContent>
                                <StudentDetailedMarksTable examReport={examReport} />
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <BookOpen className="mx-auto mb-2" />
                        <p>No exam report available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}