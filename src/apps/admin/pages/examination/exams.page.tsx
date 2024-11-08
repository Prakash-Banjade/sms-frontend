import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { DataTable } from "@/components/data-table/data-table";
import { useGetExams } from "../../components/examination/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useNavigate, useSearchParams } from "react-router-dom";
import { examsColumns } from "../../components/examination/exams/exams.columns";
import ExamsSearchFilters from "../../components/examination/exams/exams-search-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ExamsPage() {
  const navigate = useNavigate();

  return (
    <ContainerLayout
      title="Exams"
      description="List of all exams of current academic year"
      actionTrigger={
        <Button onClick={() => navigate('new')}>
          <Plus />
          Setup A New Exam
        </Button>
      }
    >
      <ExamsTable />
    </ContainerLayout>
  )
}

function ExamsTable() {
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useGetExams({
    queryString: createQueryString({
      search: searchParams.get('search'),
      page: searchParams.get('page'),
      take: searchParams.get('take'),
      examTypes: searchParams.get('examTypes'),
      classRoomId: searchParams.get('classRoomId'),
      sectionId: searchParams.get('sectionId'),
    })
  })

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={examsColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filters={<ExamsSearchFilters />}
    />
  )
}