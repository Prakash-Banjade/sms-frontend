import { TMySalaryDetails } from "@/apps/admin/types/finance-system/fee-management.types";
import DashboardCountCard from "@/components/dashboard/dashboard-count-card";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { HandCoinsIcon, PiggyBankIcon, Wallet, WalletMinimal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SalaryPaymentsTable from "@/apps/admin/components/finance-system/salary-management/salary-payroll-and-payments/all-payments/salary-payments-table";
import SalaryPayrollsTable from "../../admin/components/finance-system/salary-management/salary-payroll-and-payments/payroll/salary-payrolls-table";
import { DateRangeFilter } from "@/components/search-components/date-range-filter";

export default function MySalaryPage() {
    return (
        <ContainerLayout
            title="Salary Information"
            description="View and download your salary slips and payment history."
        >
            <MySalaryDetails />
            <Tabs defaultValue="payroll">
                <TabsList>
                    <TabsTrigger value="payroll">Payroll Slips</TabsTrigger>
                    <TabsTrigger value="payment">Payment History</TabsTrigger>
                </TabsList>
                <TabsContent value="payroll">
                    <section className="space-y-4 mt-10">
                        <header className="flex justify-between items-end gap-10">
                            <DateRangeFilter />
                        </header>
                        <SalaryPayrollsTable />
                    </section>
                </TabsContent>
                <TabsContent value="payment">
                    <section className="space-y-4 mt-10">
                        <header className="flex justify-between items-end gap-10">
                            <DateRangeFilter />
                        </header>
                        <SalaryPaymentsTable />
                    </section>
                </TabsContent>
            </Tabs>
        </ContainerLayout>
    )
}

function MySalaryDetails() {
    const { data, isLoading } = useFetchData<TMySalaryDetails>({
        queryKey: [QueryKey.SALARY_STRUCTURES, 'my-details'],
        endpoint: QueryKey.SALARY_STRUCTURES + '/my-details',
    });

    return (
        <section className="@container">
            <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 gap-4">
                <DashboardCountCard
                    title="Monthly Salary"
                    count={`Rs. ${(data?.grossSalary || 0).toLocaleString()}`}
                    icon={Wallet}
                    footer={`Basic: Rs. ${(data?.basicSalary || 0).toLocaleString()} + Allowance: Rs. ${((data?.grossSalary || 0) - (data?.basicSalary || 0)).toLocaleString()}`}
                    isLoading={isLoading}
                />
                <DashboardCountCard
                    title="Year-to-Date"
                    count={`Rs. ${(data?.totalPayment || 0).toLocaleString()}`}
                    icon={PiggyBankIcon}
                    footer={"Total earnings this year"}
                    isLoading={isLoading}
                />
                <DashboardCountCard
                    title="Remaining Pay Amount"
                    count={`Rs. ${(data?.teacher?.payAmount || 0).toLocaleString()}`}
                    icon={HandCoinsIcon}
                    footer={"Salary to be paid"}
                    isLoading={isLoading}
                />
                <DashboardCountCard
                    title="Next Payment On"
                    count={"May 30, 2025"}
                    icon={WalletMinimal}
                    footer={"10 days remaining"}
                    isLoading={isLoading}
                />
            </div>
        </section>
    )
}