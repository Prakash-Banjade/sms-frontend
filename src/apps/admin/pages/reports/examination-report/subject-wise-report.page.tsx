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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetClassRoomsOptions } from "@/apps/admin/components/class-rooms/actions";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";

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
            sectionId: searchParams.get('sectionId'),
        }),
        options: { enabled: !!examTypeId && !!classRoomId && !!examSubjectId }
    });

    if (isLoading) return <div className="mt-20 text-center">Loading...</div>;

    if (!examTypeId || !classRoomId || !examSubjectId) return <div className="mt-20 text-center">Select class room, subject and exam type to view report</div>;

    if (!data) return <div className="mt-20 text-center">No data found</div>;

    return (
        <section className="p-6 rounded-lg border space-y-6">
            <section className="flex justify-between gap-5">
                <h2 className="text-2xl font-medium">{data?.data[0]?.subjectName} Report</h2>
                <div className="flex flex-col gap-1">
                    <span>
                        Full Mark: {data?.data[0]?.fullMark}
                    </span>
                    <span>
                        Pass Mark: {data?.data[0]?.passMark}
                    </span>
                </div>
            </section>

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
                    filters={<SearchFilters enabled={!!data?.data?.length} />}
                />
            </section>
        </section>
    )
};

function SearchFilters({ enabled = false }: { enabled?: boolean }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const classRoomId = searchParams.get('classRoomId');

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
        options: { enabled }
    });

    return (
        <section className="flex gap-6">
            <SearchInput
                label="Search"
                placeholder="Search by student name"
            />
            <section className="space-y-2">
                <Label>Select class</Label>
                <Select
                    value={searchParams.get('sectionId') ?? ''}
                    onValueChange={val => {
                        !!val ? searchParams.set('sectionId', val) : searchParams.delete('sectionId');
                        setSearchParams(searchParams);
                    }}
                    disabled={!enabled || isLoading}
                >
                    <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={'all'}>All</SelectItem>
                            {
                                data?.find((classRoom) => classRoom.id === classRoomId)?.children?.map((section) => (
                                    <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>
        </section>
    )
}