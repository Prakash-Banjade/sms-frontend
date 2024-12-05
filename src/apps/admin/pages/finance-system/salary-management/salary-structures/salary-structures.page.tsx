import { useGetSalaryStructures } from "@/apps/admin/components/finance-system/salary-management/data-access";
import { salaryStructureColumns } from "@/apps/admin/components/finance-system/salary-management/salary-structures/salary-structures.columns";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { DataTable } from "@/components/data-table/data-table";
import SearchInput from "@/components/search-components/search-input";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";

export default function SalaryStructuresPage() {
  return (
    <ContainerLayout
      title="Salary Structures"
    >
      <SalaryStructuresTable />
    </ContainerLayout>
  )
}

function SalaryStructuresTable() {
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useGetSalaryStructures({
    queryString: createQueryString({
      page: searchParams.get('page'),
      take: searchParams.get('take'),
      sortBy: searchParams.get('sortBy'),
      order: searchParams.get('order'),
      search: searchParams.get('search'),
    })
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={salaryStructureColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filters={<SearchInput placeholder="By name or ID" label="Search" />}
    />
  )
}