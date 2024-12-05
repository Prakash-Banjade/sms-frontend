import { useGetSalaryStructures } from "@/apps/admin/components/finance-system/salary-management/data-access";
import { salaryStructureColumns } from "@/apps/admin/components/finance-system/salary-management/salary-structures/salary-structures.columns";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { DataTable } from "@/components/data-table/data-table";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import SearchInput from "@/components/search-components/search-input";
import { Role } from "@/types/global.type";
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
      designations: searchParams.get('designations')
    })
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={salaryStructureColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filters={<SalaryStructureSearchFilters />}
    />
  )
}

export function SalaryStructureSearchFilters() {
  return (
    <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
      <SearchInput label="Search" placeholder="Search by name" />
      <FacetedFilter
        options={[
          { label: "Teacher", value: Role.TEACHER },
          { label: "Driver", value: Role.DRIVER },
          { label: "Helper", value: Role.HELPER },
          { label: "Labor", value: Role.LABOR },
          { label: "Librarian", value: Role.LIBRARIAN },
          { label: "Receptionist", value: Role.RECEPTIONIST },
          { label: "Peon", value: Role.PEON },
          { label: "Staff", value: Role.STAFF },
        ]}
        searchKey="designations"
        title="Designation"

      />
    </section>
  )
}