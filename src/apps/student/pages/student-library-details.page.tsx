import { useGetBookTransactions } from "@/apps/admin/components/library/actions";
import LibraryStatistics from "../components/library/library-stat"
import LibraryCard from "../components/library/library-card";
import { createQueryString } from "@/utils/create-query-string";
import { EBookTransactionStatus } from "@/types/global.type";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useState } from "react";


const StudentLibraryDetailsPage = () => {
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [searchFilters, setSearchFilters] = useState({
        status: searchParams.get('status') ?? '',
    })
    const { data, isLoading } = useGetBookTransactions(
        {
            queryString: createQueryString({
                status: searchParams.get('status'),
            })
        }
    );

    const handleSearchFiltersChange = (value: string, key: keyof typeof searchFilters) => {
        setSearchFilters({ ...searchFilters, [key]: value })
        setSearchParams(key, value)
    }

    return (
        <div className="mx-auto container flex flex-col gap-6">

            <h2 className="text-lg font-semibold">My Library</h2>
            <LibraryStatistics />
            <section className="flex flex-wrap  justify-between  ">
                <h2 className="text-lg font-semibold">Book History</h2>

                <Select onValueChange={val => handleSearchFiltersChange(val, 'status')}
                    value={searchFilters.status}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={"Select Status"} />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            {
                                Object.entries(EBookTransactionStatus).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {key}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </section>


            {
                (!data || data?.data.length === 0) ?
                    <div className="h-[50vh] flex items-center justify-center  mx-auto font-semibold text-center text-muted-foreground">
                        No library record available!!
                    </div>
                    :
                    (
                        isLoading ? <Skeleton className="max-w-4xl h-1/2" /> :
                            (
                                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  items-center gap-10">
                                    {data?.data.map((transaction) => (
                                        <LibraryCard transaction={transaction} />
                                    ))}
                                </div>
                            )
                    )

            }

        </div>
    )
}

export default StudentLibraryDetailsPage
