import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, AlertTriangle, TrendingDown, GraduationCap, MapPin, Phone, Mail } from 'lucide-react'
import { TExamReportByStudent } from "@/types/examination.type"
import { getImageUrl } from "@/lib/utils"
import { ProfileAvatar } from "@/components/ui/avatar"
import ReportCardPrintBtn from "@/apps/admin/components/report/examination-report/report-card-print-preview"
import { StudentDetailedMarksTable } from "@/apps/admin/components/report/examination-report/student-detailed-marks-table"
import { InfoRow } from "../dashboard/student-profile"

export default function ExamReportCard({ report }: { report: TExamReportByStudent }) {
    const { student, examReport, percentage, gpa, grade, failedSubjectsCount, weakSubjects } = report

    return (
        <Card className="w-full  mx-auto">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <ProfileAvatar
                        src={getImageUrl(student.profileImageUrl, 'w=80')}
                        className="size-20"
                        name={`${student.firstName} ${student.lastName}`}
                    />
                    <div className="space-y-2">
                        <CardTitle>{`${student.firstName} ${student.lastName}`}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 items-center  justify-center">
                <InfoRow icon={<GraduationCap />} label="Class" value={`${student.classRoomName} (${student.parentClassName})`} />
                <InfoRow icon={<MapPin />} label="Roll Number" value={student.rollNo} />
                <InfoRow icon={<Mail />} label="Email" value={student.email} />
                <InfoRow icon={<Phone />} label="Phone" value={student.phone} />
            </CardContent>
            <CardContent>
                {examReport ? (
                    <>
                        <div className="grid gap-4 mb-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{examReport.examType.name}</h3>
                                <div className="flex gap-2 items-center">
                                    Grade:
                                    <span className="text-muted-foreground">
                                        {grade}
                                    </span>
                                </div>
                            </div>
                            <Progress value={percentage} className="w-full"

                            />
                            <div className="flex justify-between gap-8 ">
                                <p>
                                    Percentage:<span className="text-muted-foreground text-sm ml-2"> {percentage.toFixed(2)}%</span>
                                </p>
                                <p>

                                    GPA:<span className="text-muted-foreground text-sm ml-2"> {gpa.toFixed(2)}</span>
                                </p>
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
                                <span>Weak Subjects: {weakSubjects.join(', ')}</span>
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