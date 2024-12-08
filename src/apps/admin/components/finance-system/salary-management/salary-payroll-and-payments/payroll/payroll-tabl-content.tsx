import { ESalaryAdjustmentType, TSalaryEmployee } from "@/types/finance-system/salary-management.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PayrollForm from "./payroll-form"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { z } from "zod"
import { useGetLastPayroll } from "../../data-access"


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
                defaultValue={tab}
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
                                <PayrollForm
                                    salaryEmployee={salaryEmployee}
                                    payrollId={data.id}
                                    defaultValues={{
                                        advance: data.salaryAdjustments?.find(salaryAdjustment => salaryAdjustment.type === ESalaryAdjustmentType.Advance)?.amount ?? 0,
                                        date: data.date,
                                        employeeId: salaryEmployee.employee?.id,
                                        salaryAdjustments: data.salaryAdjustments?.filter(sa => sa.type === ESalaryAdjustmentType.Deduction || sa.type === ESalaryAdjustmentType.Bonus),
                                    }}
                                />
                            ) : <div className="text-muted-foreground my-20 text-center">No payroll has been created yet!</div>
                    }
                </TabsContent>
            </Tabs>
        </section>

    )
}