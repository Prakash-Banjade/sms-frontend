import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { Card, CardContent } from "@/components/ui/card"
import FeeBillingAndPaymentTabs from "@/apps/admin/components/finance-system/fee-management/fee-billings-and-payments/fee-billing-and-payment-tabs"

export default function SingleStudentFeeDetailsPage() {
    const { searchParams, setSearchParams } = useCustomSearchParams()

    const [studentId, setStudentId] = useState(searchParams.get('studentID') || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSearchParams('studentID', studentId)
    }

    return (
        <div className="container mx-auto @container">
            <Card>
                <CardContent className="p-6">
                    <form className="flex gap-4 items-end" onSubmit={handleSubmit}>
                        <section className="space-y-2">
                            <Label htmlFor="studentID">Student ID</Label>
                            <Input
                                name="studentID"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="Enter student ID" className="w-80"
                            />
                        </section>
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            <FeeBillingAndPaymentTabs />
        </div>
    )
}