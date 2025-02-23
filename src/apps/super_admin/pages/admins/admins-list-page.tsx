import ContainerLayout from "@/components/page-layouts/container-layout";
import { DataTable } from "@/components/data-table/data-table";
import { useGetUsers } from "../../data-access/users-data-access";
import { createQueryString } from "@/utils/create-query-string";
import { Role } from "@/types/global.type";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usersColumns } from "../../components/users/users-column";
import SearchInput from "@/components/search-components/search-input";
import BranchSearchFilter from "@/components/search-components/branch-search-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


export default function AdminsListPage() {
    const navigate = useNavigate();

    return (
        <ContainerLayout
            title="View all admins"
            description="All the admins of different branch."
            actionTrigger={
                <Button type="button" onClick={() => navigate('new')}>
                    <Plus /> New Admin
                </Button>
            }
        >
            <AdminListTable />
        </ContainerLayout>
    )
}

const AdminListTable = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetUsers({
        queryString: createQueryString({
            role: Role.ADMIN,
            search: searchParams.get('search'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            branchId: searchParams.get('branchId'),
        })
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <DataTable
            columns={usersColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<AdminsSearchFilters />}
        />
    )
}

const AdminsSearchFilters = () => {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by name" label="Name" />
            <BranchSearchFilter />
        </section>
    )
}