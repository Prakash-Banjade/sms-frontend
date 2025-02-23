import ContainerLayout from "@/components/page-layouts/container-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetChargeHeads } from "../../../components/finance-system/fee-management/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table/data-table";
import SearchInput from "@/components/search-components/search-input";
import { chargeHeadColumns } from "../../../components/finance-system/fee-management/charge-heads/charge-head-columns";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useState } from "react";
import ChargeHeadFrom from "../../../components/finance-system/fee-management/charge-heads/charge-head-form";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { EChargeHeadType } from "@/types/finance-system/fee-management.types";

export default function ChargeHeadsPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <ContainerLayout
            title="Charge Heads"
            description="Manage charge heads for fees"
            actionTrigger={
                <>
                    <ResponsiveDialog
                        isOpen={isAddOpen}
                        setIsOpen={setIsAddOpen}
                        title="Add Charge Head"
                    >
                        <ChargeHeadFrom setIsOpen={setIsAddOpen} />
                    </ResponsiveDialog>
                    <Button type="button" onClick={() => setIsAddOpen(true)}>
                        <Plus />
                        New Charge Head
                    </Button>
                </>
            }
        >
            <ChargeHeadsList />
        </ContainerLayout>
    )
}

function ChargeHeadsList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetChargeHeads({
        queryString: createQueryString({
            search: searchParams.get("search"),
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            order: 'ASC',
            types: searchParams.get("types"),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={chargeHeadColumns}
            data={data?.data || []}
            meta={data?.meta}
            filters={<section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
                <SearchInput label="Search" placeholder="Search by name" />
                <FacetedFilter searchKey="types" title="Type" options={[{ label: "Regular", value: EChargeHeadType.Regular }, { label: "Ad Hoc", value: EChargeHeadType.Ad_Hoc }]} />
            </section>}
        />
    )
}