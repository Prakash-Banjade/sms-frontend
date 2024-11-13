import { useGetBookTransactions } from "@/apps/admin/components/library/actions";
import LibraryStatistics from "../components/library/library-stat"
import LibraryCard from "../components/library/library-card";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { EBookTransactionStatus } from "@/types/global.type";


const StudentLibraryDetailsPage = () => {
    const [searchParams] = useSearchParams()
    const { data, isLoading } = useGetBookTransactions(
        {
            queryString: createQueryString({
                search: searchParams.get('status'),
            })
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (!data || data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                No library record available!!
            </div>
        );
    }
    return (
        <div className="mx-auto container flex flex-col gap-6">

            <h2 className="text-lg font-semibold">My Library</h2>
            <LibraryStatistics />
            <section className="flex flex-wrap  justify-between ">
                <h2 className="text-lg font-semibold">Book History</h2>
                <FacetedFilter title="Trasaction Status" searchKey="status" options={Object.entries(EBookTransactionStatus).map(([_, value]) => ({ label: value, value }))} />
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  items-center gap-10">
                {
                    data?.data.map((transaction) => (
                        <LibraryCard transaction={transaction} />
                    ))
                }
            </div>
        </div>
    )
}

export default StudentLibraryDetailsPage
