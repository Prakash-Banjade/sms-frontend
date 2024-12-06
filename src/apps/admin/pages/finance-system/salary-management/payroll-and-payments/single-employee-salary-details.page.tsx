import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { Card, CardContent } from "@/components/ui/card"
import SalaryPayrollAndPaymentTabs from "@/apps/admin/components/finance-system/salary-management/salary-payroll-and-payments/salary-payroll-and-payment-tabs"

export default function SingleEmployeeSalaryDetailsPage() {
    const { searchParams, setSearchParams } = useCustomSearchParams()

    const [employeeId, setEmployeeId] = useState(searchParams.get('employeeID') || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSearchParams('employeeID', employeeId)
    }

    return (
        <div className="container mx-auto @container">
            <Card>
                <CardContent className="p-6">
                    <form className="flex gap-4 items-end" onSubmit={handleSubmit}>
                        <section className="space-y-2">
                            <Label htmlFor="employeeID">Employee ID</Label>
                            <Input
                                name="employeeID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="Enter employee ID" className="w-80"
                            />
                        </section>
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            <SalaryPayrollAndPaymentTabs />
        </div>
    )
}