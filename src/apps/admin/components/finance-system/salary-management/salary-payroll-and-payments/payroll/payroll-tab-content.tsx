import { ESalaryAdjustmentType, TLastPayroll, TSalaryEmployee } from "@/apps/admin/types/finance-system/salary-management.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PayrollForm from "./payroll-form"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { z } from "zod"
import { useGetLastPayroll } from "../../data-access"
import { sub } from "date-fns"
import { startOfDayString } from "@/lib/utils"

type Props = {
    salaryEmployee: TSalaryEmployee
}

const tabsSchema = z.enum(['new', 'last']);

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

    return (
        <section className="pt-4">
            <Tabs
                value={tab}
                onValueChange={tab => setSearchParams('sub-tab', tab)}
            >
                <TabsList className="">
                    <TabsTrigger value="new">New Payroll</TabsTrigger>
                    <TabsTrigger value="last">Last Payroll</TabsTrigger>
                </TabsList>
                <TabsContent value="new">
                    <PayrollForm salaryEmployee={salaryEmployee} />
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
            </Tabs>
        </section>

    )
}

function UpdatePayroll({ data, salaryEmployee }: { data: TLastPayroll, salaryEmployee: TSalaryEmployee }) {
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