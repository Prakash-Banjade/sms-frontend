import { useGetExamResults } from "@/apps/admin/components/examination/data-access";
import ClassWiseExamReportTable from "@/apps/admin/components/report/examination-report/class-wise-report/class-wise-exam-report-table";
import GetExamReportByClassForm from "@/apps/admin/components/report/examination-report/class-wise-report/get-exam-report-by-class-form";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { createQueryString } from "@/utils/create-query-string";
import { useMemo } from "react";


export default function ExaminationReport_ClassWise() {
    return (
        <ContainerLayout
            title="Class Wise Examination Report"
        >
            <GetExamReportByClassForm />
            <ReportSection />
        </ContainerLayout>
    )
}

function ReportSection() {
    const { searchParams } = useCustomSearchParams();

    const { examTypeId, classRoomId, academicYearId } = useMemo(() => {
        return {
            classRoomId: searchParams.get('classRoomId'),
            examTypeId: searchParams.get('examTypeId'),
            academicYearId: searchParams.get('academicYearId'),
        }
    }, [searchParams]);

    const { data, isLoading } = useGetExamResults({
        queryString: createQueryString({
            classRoomId,
            academicYearId,
            examTypeId,
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            search: searchParams.get('search'),
            sectionId: searchParams.get('sectionId'),
        }),
        options: { enabled: !!examTypeId && !!classRoomId && !!academicYearId }
    });

    if (isLoading) return <div className="mt-20 text-center">Loading...</div>;

    if (!examTypeId || !classRoomId || !academicYearId) return <div className="mt-20 text-center text-muted-foreground">Select class room, academic year and exam type to view report</div>;

    if (!data) return <div className="mt-20 text-center text-muted-foreground">No data found</div>;

    return (
        <section className="space-y-6">
            <ClassWiseExamReportTable data={data} />
            <DataTablePagination meta={data?.meta} />
        </section>
    )
}