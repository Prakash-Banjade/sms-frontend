import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HandCoins, NotebookText, ReceiptText } from "lucide-react";
import { TSalaryEmployee } from "@/types/finance-system/salary-management.types";
import { useGetSalaryEmployee } from "../data-access";
import { Badge } from "@/components/ui/badge";
import PayrollTabContent from "./payroll/payroll-tab-content";
import SalaryPayment from "./payment/salary-payment";
import SalaryPaymentsTable from "./all-payments/salary-payments-table";

const tabs = [
    {
        value: 'payroll',
        label: 'Payroll',
        icon: ReceiptText,
    },
    {
        value: 'makePayment',
        label: 'Make Payment',
        icon: HandCoins,
    },
    {
        value: 'allPayments',
        label: 'All Payments',
        icon: NotebookText,
    }
]

export default function SalaryPayrollAndPaymentTabs() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetSalaryEmployee({
        id: searchParams.get('employeeID')!,
        options: {
            enabled: !!searchParams.get('employeeID'),
        }
    });

    if (!searchParams.get('employeeID')) return <div className="h-[400px] grid place-items-center text-muted-foreground">Enter employee ID to view salary details</div>

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No employee found</div>;

    return (
        <section className="space-y-6 mt-6 mb-40">
            <EmployeeDetails employee={data?.employee} />
            <Tabs
                defaultValue={searchParams.get('tab') || tabs[0].value}
                onValueChange={tab => setSearchParams('tab', tab)}
            >
                <TabsList className={`h-auto grid !grid-cols-3`}>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="py-2">
                            <tab.icon size={16} className="mr-2" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={tabs[0].value}>
                    <PayrollTabContent salaryEmployee={data} />
                </TabsContent>
                <TabsContent value={tabs[1].value}>
                    <SalaryPayment employeeId={data.employee?.id} />
                </TabsContent>
                <TabsContent value={tabs[2].value}>
                    <SalaryPaymentsTable employeeId={data.employee?.id} />
                </TabsContent>
            </Tabs>

        </section>
    )
}

function EmployeeDetails({ employee }: { employee: TSalaryEmployee['employee'] | undefined }) {
    if (!employee) return null;

    return (
        <Card>
            <CardContent className="p-6 flex gap-6 items-center">
                <ProfileAvatar name={employee?.fullName} src={getImageUrl(employee?.profileImageUrl, 'w=128')} className="size-32" />
                <section className="space-y-3">
                    <section className="space-y-1">
                        <CardTitle>{employee?.fullName}</CardTitle>
                        <CardDescription>
                            <Badge variant={'outline'} className="capitalize">{employee?.designation}</Badge>
                        </CardDescription>
                    </section>
                    <section className="flex gap-24">
                        <div className="space-y-1">
                            <p>Employee ID: {employee?.employeeId}</p>
                            <p>Pay Amount: Rs. {employee?.payAmount?.toLocaleString()}</p>
                        </div>

                        <div className="space-y-1">
                            <p>Phone: {employee?.phone}</p>
                            <p>Email: {employee?.email}</p>
                        </div>
                    </section>
                </section>
            </CardContent>
        </Card>
    )
}