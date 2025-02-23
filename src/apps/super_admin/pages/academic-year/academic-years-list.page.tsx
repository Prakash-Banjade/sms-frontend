import { DataTable } from "@/components/data-table/data-table"
import { academicYearColumns } from "../../components/academic-year/academic-years.columns"
import { useSearchParams } from "react-router-dom"
import { useGetAcademicYears } from "../../data-access/academic-year-data-access"
import ContainerLayout from "@/components/page-layouts/container-layout"
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AcademicYearsListPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetAcademicYears({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ContainerLayout
            title="Academic Years"
            description="View all academic years in your school management system."
            actionTrigger={
                <Button onClick={() => navigate('new')}>
                    <Plus />
                    New Academic Year
                </Button>
            }
        >
            <DataTable
                columns={academicYearColumns}
                data={data?.data ?? []}
                meta={data?.meta}
            />

        </ContainerLayout>
    )
}