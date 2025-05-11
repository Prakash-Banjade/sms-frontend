import { ESalaryAdjustmentType, TSinglePayroll, TSalaryEmployee } from "@/apps/admin/types/finance-system/salary-management.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PayrollForm from "./payroll-form"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { z } from "zod"
import { addMonths, isBefore, isSameMonth, sub, subMonths } from "date-fns"
import { startOfDayString } from "@/lib/utils"
import SalaryPayrollsTable from "./salary-payrolls-table"
import { useGetLastPayroll } from "../../data-access"
import { DateRangeFilter } from "@/components/search-components/date-range-filter"
import { useMemo } from "react"

type Props = {
    salaryEmployee: TSalaryEmployee
}

const tabsSchema = z.enum(['new', 'last', 'all']);

export default function PayrollTabContent({ salaryEmployee }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { success } = tabsSchema.safeParse(searchParams.get('sub-tab') || 'new');
    const tab = success ? searchParams.get('sub-tab') || 'new' : 'new';

    const { data, isLoading } = useGetLastPayroll({
        id: salaryEmployee.employee?.id,
        options: {
            enabled: (!!salaryEmployee.employee?.id && searchParams.get('sub-tab') === 'last'),
        },
    });

    const isPayrollGenerationAvailable = useMemo(() => {
        const { lastPayrollDate } = salaryEmployee;

        if (!lastPayrollDate) return true; // no payroll generated, so available to generate

        const newSalaryDate = lastPayrollDate ? addMonths(lastPayrollDate, 1) : subMonths(new Date(), 1);

        return isBefore(newSalaryDate, new Date()) && !isSameMonth(newSalaryDate, new Date());
    }, [salaryEmployee])

    return (
        <section className="pt-4">
            <Tabs
                value={tab}
                onValueChange={tab => setSearchParams('sub-tab', tab)}
            >
                <TabsList className="">
                    <TabsTrigger value="new">New Payroll</TabsTrigger>
                    <TabsTrigger value="last">Last Payroll</TabsTrigger>
                    <TabsTrigger value="all">All Payrolls</TabsTrigger>
                </TabsList>
                <TabsContent value="new">
                    {
                        isPayrollGenerationAvailable
                            ? <PayrollForm salaryEmployee={salaryEmployee} />
                            : <div className="my-20 text-center text-muted-foreground">Payroll for previous month is already generated</div>
                    }
                </TabsContent>
                <TabsContent value="last">
                    {
                        isLoading
                            ? <div className="my-20 text-center">Loading...</div>
                            : data ? (
                                <UpdatePayroll data={data} salaryEmployee={salaryEmployee} />
                            ) : <div className="text-muted-foreground my-20 text-center">No payroll has been created yet!</div>
                    }
                </TabsContent>
                <TabsContent value="all">
                    <section className="space-y-4 mt-10">
                        <header className="flex justify-between items-end gap-10">
                            <DateRangeFilter />
                        </header>
                        <SalaryPayrollsTable />
                    </section>
                </TabsContent>
            </Tabs>
        </section>

    )
}

function UpdatePayroll({ data, salaryEmployee }: { data: TSinglePayroll, salaryEmployee: TSalaryEmployee }) {
    if (!data) return null;

    return (
        <PayrollForm
            salaryEmployee={{
                ...salaryEmployee,
                employee: {
                    ...salaryEmployee.employee,
                    payAmount: data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Unpaid)?.amount ?? 0,
                },
                lastPayrollDate: startOfDayString(sub(data.date, { months: 1 })), // Subtract 1 month from the date to get the last payroll date
                lastAdvanceAmount: data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Past_Advance)?.amount ?? 0,
            }}
            payrollId={data.id}
            defaultValues={{
                advance: data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Advance)?.amount ?? 0,
                date: data.date,
                employeeId: salaryEmployee.employee?.id,
                salaryAdjustments: data.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Deduction || sa.type === ESalaryAdjustmentType.Bonus),
            }}
            paidSalary={data.paidSalary}
        />
    )
}