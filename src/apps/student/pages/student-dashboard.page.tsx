import ContainerLayout from "@/components/page-layouts/container-layout"
import { useAuth } from "@/contexts/auth-provider"
import UpcommingEvents from "@/apps/admin/components/dashboard/upcomming-events"
import RecentNotices from "@/apps/admin/components/dashboard/recent-notices"
import RemainingAssignmentsCard from "../components/dashboard/remaining-assignments-card"
import TodayClassRoutinesCard from "../components/dashboard/today-class-routines-card"
import UpcommingExamCard from "../components/dashboard/upcomming-exam-card"
import MyFeesStatisticsCard from "../components/dashboard/my-fees-statistics-card"
import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
    const { payload } = useAuth();

    const { data, isLoading } = useFetchData<{ fullName: string }>({
        endpoint: QueryKey.CLASSES + '/my-class',
        queryKey: [QueryKey.CLASSES + '/my-class'],
    })

    return (
        <ContainerLayout
            title={`Welcome, ${payload?.firstName} ${payload?.lastName}!`}
            description={isLoading ? <Skeleton className="h-4 w-48" /> : data?.fullName}
        >
            <div className="@container">
                <div className="grid grid-cols-1 @6xl:grid-cols-3 @6xl:gap-x-6 gap-y-6 mb-20">
                    <section className="col-span-2 grid @4xl:grid-cols-2 gap-6">
                        <RemainingAssignmentsCard />
                        <RecentNotices />
                        <section className="@4xl:col-span-2">
                            <UpcommingExamCard />
                        </section>
                    </section>

                    <div className="@container/parent">
                        <section className="grid grid-cols-1 @4xl/parent:grid-cols-2 gap-6">
                            <MyFeesStatisticsCard />
                            <TodayClassRoutinesCard />
                            <UpcommingEvents />
                        </section>
                    </div>
                </div>
            </div>
        </ContainerLayout>
    )
}
