import { useGetExamReportBySubject } from "@/apps/admin/components/examination/data-access";
import GetExamReportBySubjectForm from "@/apps/admin/components/report/examination-report/subject-wise-report/generate-report-form";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createQueryString } from "@/utils/create-query-string";
import SearchInput from "@/components/search-components/search-input";
import { DataTable } from "@/components/data-table/data-table";
import { subjectWiseReportColumns } from "@/apps/admin/components/report/examination-report/subject-wise-report/subject-wise-report.column";

export default function ExaminationReport_SubjectWise() {
    return (
        <ContainerLayout
            title="Subject-wise Exam Report"
        >
            <GetExamReportBySubjectForm />
            <ReportSection />
        </ContainerLayout>
    )
}

function ReportSection() {
    const { searchParams } = useCustomSearchParams();

    const { examTypeId, classRoomId, examSubjectId } = useMemo(() => {
        return {
            classRoomId: searchParams.get('classRoomId'),
            examSubjectId: searchParams.get('subjectId'),
            examTypeId: searchParams.get('examTypeId'),
        }
    }, [searchParams]);

    const { data, isLoading } = useGetExamReportBySubject({
        queryString: createQueryString({
            classRoomId,
            examSubjectId,
            examTypeId,
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            search: searchParams.get('search'),
        }),
        options: { enabled: !!examTypeId && !!classRoomId && !!examSubjectId }
    });

    if (isLoading) return <div className="mt-20 text-center">Loading...</div>;

    if (!examTypeId || !classRoomId || !examSubjectId) return <div className="mt-20 text-center">Select class room, subject and exam type to view report</div>;

    if (!data) return <div className="mt-20 text-center">No data found</div>;

    return (
        <section className="p-6 rounded-lg border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Passed Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{data.count?.totalPassed}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Failed Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{data.count?.totalFailed}</p>
                    </CardContent>
                </Card>
            </div>

            <section className="space-y-6">
                <DataTable
                    data={data?.data ?? []}
                    columns={subjectWiseReportColumns}
                    meta={data?.meta}
                    filters={<section className="flex gap-6">
                        <SearchInput label="Search" placeholder="Search by student name" className="w-full" />
                    </section>}
                />

                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Roll No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Full Mark</TableHead>
                            <TableHead>Pass Mark</TableHead>
                            <TableHead>Obtained Marks</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>GPA</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Remark</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.rollNo}</TableCell>
                                <TableCell>{report.fullName}</TableCell>
                                <TableCell>{report.fullMark}</TableCell>
                                <TableCell>{report.passMark}</TableCell>
                                <TableCell>{report.obtainedMarks}</TableCell>
                                <TableCell>{report.percentage}</TableCell>
                                <TableCell>{report.gpa}</TableCell>
                                <TableCell>{report.grade}</TableCell>
                                <TableCell>
                                    {
                                        report.obtainedMarks >= report.passMark
                                            ? <Badge variant={'success'}>Passed</Badge>
                                            : <Badge variant={'destructive'}>Failed</Badge>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            </section>
        </section>
    )
};