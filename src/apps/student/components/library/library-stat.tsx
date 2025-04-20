import { useGetLibraryOverviewCount } from "@/apps/admin/components/library/actions"
import DashboardCountCard from "@/components/dashboard/dashboard-count-card"
import { TSt_TrasactionCount } from "@/apps/admin/types/library-book.type"
import { AlertTriangle, Book, BookOpen } from "lucide-react"



const LibraryStatistics = () => {
    const { data, isLoading } = useGetLibraryOverviewCount<TSt_TrasactionCount>()
    if (!data) return <div className="min-h-40 text-muted-foreground text-center">
        No library Statistics available
    </div>
    if (isLoading) return <div>Loading..</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCountCard title="Total Trasaction" count={data?.totalCount || 0} icon={BookOpen} isLoading={isLoading} />
            <DashboardCountCard title="Borrowed" count={data?.issuedCount || 0} icon={Book} isLoading={isLoading} />
            <DashboardCountCard title="Overdue" count={data?.overdueCount || 0} icon={AlertTriangle} isLoading={isLoading} />

        </div>
    )
}

export default LibraryStatistics
