import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useGetBranches } from "../../data-access/branches-data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table/data-table";
import { branchesColumns } from "../../components/branches/branches-column";
import SearchInput from "@/components/search-components/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import BranchForm from "../../components/branches/branch-form";
import { useEffect, useState } from "react";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

export default function BranchesListPage() {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [isOpen, setIsOpen] = useState(searchParams.get('new-branch') === 'true');

    useEffect(() => {
        if (!isOpen) setSearchParams('new-branch', undefined);
    }, [isOpen]);

    return (
        <ContainerLayout
            title="View all branches"
            description="All the branches of the entire school."
            actionTrigger={
                <>
                    <ResponsiveDialog
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        title="Add new branch"
                    >
                        <BranchForm setIsOpen={setIsOpen} />
                    </ResponsiveDialog>

                    <Button type="button" onClick={() => setIsOpen(true)}>
                        <Plus />
                        New Branch
                    </Button>
                </>
            }
        >
            <BranchListTable />
        </ContainerLayout>
    )
}

const BranchListTable = () => {
    const [searchParams] = useSearchParams();

    const { data: branches, isLoading } = useGetBranches({
        queryString: createQueryString({
            search: searchParams.get('search'),
        })
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <DataTable
            columns={branchesColumns}
            data={branches?.data ?? []}
            meta={branches?.meta}
            filters={<section className="flex flex-wrap lg:gap-5 gap-3 w-full">
                <SearchInput placeholder="Search by name" label="Name" />
            </section>}
        />
    )
}