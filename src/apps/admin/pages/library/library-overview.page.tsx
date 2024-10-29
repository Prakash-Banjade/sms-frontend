import DashboardCountCard from "@/components/dashboard/dashboard-count-card"
import { ArrowLeftRight, BookOpen, Calendar, UserCheck } from "lucide-react"
import RecentLibraryBookTransactions from "../../components/library/library-overview/recent-transactions"
import DetailedLibraryBookTransactions from "../../components/library/library-overview/detailed-transactions"
import Library_StudentsOverview from "../../components/library/library-overview/students-overview"
import { useGetLibraryOverviewCount } from "../../components/library/actions"

export default function LibraryOverviewPage() {
    const { data: count, isLoading } = useGetLibraryOverviewCount();

    return (
        <div className="container mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <DashboardCountCard title="Total Books" count={count?.booksCount || 0} icon={BookOpen} navigateTo="books" isLoading={isLoading} />
                <DashboardCountCard title="Total Transactions" count={count?.transactionCount || 0} icon={ArrowLeftRight} isLoading={isLoading} />
                <DashboardCountCard title="Currently Issued" count={count?.issuedCount || 0} icon={UserCheck} isLoading={isLoading} />
                <DashboardCountCard title="Overdue Books" count={count?.overdueCount || 0} icon={Calendar} isLoading={isLoading} />
            </div>

            <section className="mb-6 grid grid-cols-1 @7xl:grid-cols-3 @7xl:gap-x-6 gap-y-6">
                <div className="col-span-2">
                    <RecentLibraryBookTransactions />
                </div>
                <Library_StudentsOverview
                    topBooks={count?.topBooks || []}
                    totalStudents={count?.studentsCount || 0}
                    issuedStudents={count?.issuedStudentCount || 0}
                />
            </section>

            <DetailedLibraryBookTransactions />
        </div>
    )
}