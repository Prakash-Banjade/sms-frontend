import { useGetExamReportBySubject } from "@/apps/admin/components/examination/data-access";
import GetExamReportBySubjectForm from "@/apps/admin/components/report/examination-report/subject-wise-report/generate-report-form";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useMemo } from "react";
import { createQueryString } from "@/utils/create-query-string";
import SearchInput from "@/components/search-components/search-input";
import { DataTable } from "@/components/data-table/data-table";
import { subjectWiseReportColumns } from "@/apps/admin/components/report/examination-report/subject-wise-report/subject-wise-report.column";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetClassRoomsOptions } from "@/apps/admin/components/class-rooms/actions";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import DashboardCountCard from "@/components/dashboard/dashboard-count-card";

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

    if (!data) return <div className="mt-20 text-center text-muted-foreground">No data found</div>;

    // if (!data?.data?.length) return <div className="mt-20 text-center text-muted-foreground">Exam not held or not evaluated yet!</div>; // no student report is evaluated yet

    return (
        <section className="p-6 rounded-lg border space-y-6 @container">
            <section className="flex justify-between gap-5">
                <h2 className="text-2xl font-medium">{data?.examSubject?.subjectName} Report</h2>
                <div className="flex gap-8">
                    <section>
                        <span className="text-xs text-muted-foreground">Full Mark</span>
                        <div className="flex flex-col">
                            <span>Theory: {data?.examSubject?.theoryFM}</span>
                            <span>Practical: {data?.examSubject?.practicalFM}</span>
                        </div>
                    </section>
                    <section>
                        <span className="text-xs text-muted-foreground">Pass Mark</span>
                        <div className="flex flex-col">
                            <span>Theory: {data?.examSubject?.theoryPM}</span>
                            <span>Practical: {data?.examSubject?.practicalPM}</span>
                        </div>
                    </section>
                </div>
            </section>

            <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 gap-6">
                <DashboardCountCard className="col-span-2" count={data?.count?.totalPassed} title="Total Passed Students" />
                <DashboardCountCard className="col-span-2" count={data?.count?.totalFailed} title="Total Failed Students" />
                <DashboardCountCard count={data?.count?.theoryPassed} title="Passed In Theory" />
                <DashboardCountCard count={data?.count?.theoryFailed} title="Failed In Theory" />
                <DashboardCountCard count={data?.count?.practicalPassed} title="Passed In Practical" />
                <DashboardCountCard count={data?.count?.practicalFailed} title="Failed In Practical" />
            </div>

            <section className="space-y-6">
                <DataTable
                    data={data?.data ?? []}
                    columns={subjectWiseReportColumns}
                    meta={data?.meta}
                    filters={<SearchFilters />}
                    reset={false}
                />
            </section>
        </section>
    )
};

function SearchFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const classRoomId = searchParams.get('classRoomId');

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
        options: { enabled: !!classRoomId }
    });

    return (
        <section className="flex gap-6">
            <SearchInput
                label="Search"
                placeholder="Search by student name"
            />
            <section className="space-y-2">
                <Label>Select section</Label>
                <Select
                    value={searchParams.get('sectionId') ?? ''}
                    onValueChange={val => {
                        (!!val && val !== 'all') ? searchParams.set('sectionId', val) : searchParams.delete('sectionId');
                        setSearchParams(searchParams);
                    }}
                    disabled={!classRoomId || isLoading}
                >
                    <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={'all'} className="text-xs text-muted-foreground">Select Section</SelectItem>
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