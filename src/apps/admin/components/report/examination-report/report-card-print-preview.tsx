import { ProfileAvatar } from '@/components/ui/avatar'
import { getImageUrl } from '@/lib/utils'
import { TExamReportByStudent } from '@/apps/admin/types/examination.type'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, User, BookOpen, Printer, MapPin } from "lucide-react"
import { StudentDetailedMarksTable } from './student-detailed-marks-table'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useGetActiveAcademicYear } from '../../../../super_admin/data-access/academic-year-data-access'
import { thisSchool } from '@/CONSTANTS'

type Props = {
    data: TExamReportByStudent;
}

export default function ReportCardPrintBtn({ data }: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { data: academicYear, isLoading } = useGetActiveAcademicYear({});


    const handlePrint = useReactToPrint({ contentRef });

    if (isLoading) return null;

    return (
        <section>
            <Button type="button" onClick={() => handlePrint()}>
                <Printer />
                Print
            </Button>
            <div className="container mx-auto p-4 max-w-4xl hidden print:block" ref={contentRef}>
                <Card className="border-4 border-primary">
                    <CardHeader className="text-center border-b border-primary">
                        <div>
                            <h1 className="text-3xl font-bold">{thisSchool.name}</h1>
                            <p className="text-muted-foreground flex items-center justify-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {thisSchool.address}
                            </p>
                        </div>
                        <CardTitle className="text-xl font-bold">Student Report Card</CardTitle>
                        <p className="text-muted-foreground">Academic Year: {academicYear?.name}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <ProfileAvatar
                                src={getImageUrl(data.student?.profileImageUrl, 'w=100')}
                                name={data.student?.firstName + " " + data.student?.lastName}
                                className="w-24 h-24 rounded-full"
                            />
                            <section>
                                <h2 className="text-2xl font-bold">{data.student?.firstName + " " + data.student?.lastName}</h2>
                                <div className='flex gap-10'>
                                    <div className='space-y-1'>
                                        <p className="text-muted-foreground flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Roll No: {data.student?.rollNo}
                                        </p>
                                        <p className="text-muted-foreground flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Class: {
                                                data.student?.parentClassName
                                                    ? `${data.student?.parentClassName} - ${data.student?.classRoomName}`
                                                    : data.student?.classRoomName
                                            }
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {data.student?.phone}
                                        </p>
                                        <p className="text-muted-foreground flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {data.student?.email}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <StudentDetailedMarksTable examReport={data.examReport} />

                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-lg font-semibold">
                                Overall Percentage: {data.percentage}%
                            </div>
                            <div className="text-lg font-semibold flex flex-col items-end">
                                <span>GPA: {data.gpa?.toFixed(2)}</span>
                                <span>Grade: {data.grade}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-primary">
                            <h3 className="text-lg font-semibold mb-2">Remarks:</h3>
                            <p className="text-muted-foreground">
                                {data.student.firstName + " " + data.student.lastName} has shown commendable performance this academic year.
                                Continue to focus on improving in Social Studies to achieve better overall results.
                            </p>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <div className="w-1/3">
                                <p className="font-semibold">Class Teacher's Signature</p>
                                <div className="mt-8 border-b border-primary"></div>
                            </div>
                            <div className="w-1/3 text-center">
                                <p className="font-semibold">Principal's Signature</p>
                                <div className="mt-8 border-b border-primary"></div>
                            </div>
                            <div className="w-1/3 text-right">
                                <p className="font-semibold">Parent's Signature</p>
                                <div className="mt-8 border-b border-primary"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}