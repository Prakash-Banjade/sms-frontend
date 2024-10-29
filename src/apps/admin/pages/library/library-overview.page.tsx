import DashboardCountCard from "@/components/dashboard/dashboard-count-card"
import { BookOpen, Calendar, RotateCcw, UserCheck } from "lucide-react"
import RecentLibraryBookTransactions from "../../components/library/library-overview/recent-transactions"
import DetailedLibraryBookTransactions from "../../components/library/library-overview/detailed-transactions"
import Library_StudentsOverview from "../../components/library/library-overview/students-overview"

export default function LibraryOverviewPage() {
    return (
        <div className="container mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <DashboardCountCard title="Total Books" count={1251} icon={BookOpen} navigateTo="books" />
                <DashboardCountCard title="Currently Issued" count={45} icon={UserCheck} />
                <DashboardCountCard title="Total Transactions" count={775} icon={RotateCcw} />
                <DashboardCountCard title="Overdue Books" count={15} icon={Calendar} />
            </div>

            <section className="mb-6 grid grid-cols-1 @4xl:grid-cols-3 @4xl:gap-x-6 gap-y-6">
                <div className="col-span-2">
                    <RecentLibraryBookTransactions />
                </div>
                <Library_StudentsOverview />
            </section>

            <DetailedLibraryBookTransactions />
        </div>
    )
}