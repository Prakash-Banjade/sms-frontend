import DashboardCountCard from "@/components/dashboard/dashboard-count-card"
import { AlertTriangle, Book, BookOpen, CheckCircle } from "lucide-react"

const bookCounts = {
    total: 5,
    borrowed: 2,
    overdue: 2,
    returned: 1,
}

const LibraryStatistics = () => {
    const isLoading = false
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCountCard title="Total Books" count={bookCounts?.total || 0} icon={BookOpen} isLoading={isLoading} />
            <DashboardCountCard title="Borrowed " count={bookCounts?.borrowed || 0} icon={Book} isLoading={isLoading} />
            <DashboardCountCard title="Overdue" count={bookCounts?.overdue || 0} icon={AlertTriangle} isLoading={isLoading} />
            <DashboardCountCard title="Returned" count={bookCounts?.returned || 0} icon={CheckCircle} isLoading={isLoading} />
            {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bookCounts.total}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bookCounts.borrowed}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bookCounts.overdue}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Returned</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bookCounts.returned}</div>
                </CardContent>
            </Card> */}
        </div>
    )
}

export default LibraryStatistics
