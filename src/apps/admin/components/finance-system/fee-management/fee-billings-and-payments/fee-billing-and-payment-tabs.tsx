import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetFeeStudent } from "../data-access";
import { TFeeStudent } from "@/apps/admin/types/finance-system/fee-management.types";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HandCoins, LibraryBig, NotebookText, ReceiptText } from "lucide-react";
import FeeInvoiceForm from "./fee-invoice/fee-invoice-form";
import StudentLedgerView from "./fee-ledger/student-ledger-view";
import FeePaymentForm from "./fee-payment.tsx/fee-payment-form";
import LibraryFinePayment from "./library-fine/library-fine-payment";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

const tabs = [
    {
        value: 'invoice',
        label: 'Invoice',
        icon: ReceiptText,
    },
    {
        value: 'payment',
        label: 'Payment',
        icon: HandCoins,
    },
    {
        value: 'library-fine',
        label: 'Library Fine',
        icon: LibraryBig,
    },
    {
        value: 'ledger',
        label: 'Ledger',
        icon: NotebookText,
    }
]

export default function FeeBillingAndPaymentTabs() {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const { setDynamicBreadcrumb } = useSidebar();

    const { data, isLoading } = useGetFeeStudent({
        id: searchParams.get('studentID')!,
        options: {
            enabled: !!searchParams.get('studentID'),
        }
    });

    useEffect(() => {
        if (data) {
            setDynamicBreadcrumb([
                {
                    label: data.student.name,
                    url: `/finance/fee-management/billing-and-payments/student?studentID=${data.student.studentId}`,
                }
            ])
        }
    }, [data, searchParams.get('tab')])

    if (!searchParams.get('studentID')) return <div className="h-[400px] grid place-items-center text-muted-foreground">Enter student ID to view transactions</div>

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No student found.</div>;

    return (
        <section className="space-y-6 mt-6 mb-40">
            <StudentDetails feeStudent={data.student} />
            <Tabs
                defaultValue={searchParams.get('tab') || tabs[0].value}
                onValueChange={tab => setSearchParams('tab', tab)}
            >
                <TabsList className={`h-auto grid !grid-cols-4`}>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="py-2">
                            <tab.icon size={16} className="mr-2" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={tabs[0].value}>
                    <FeeInvoiceForm feeStudent={data} />
                </TabsContent>
                <TabsContent value={tabs[1].value}>
                    <FeePaymentForm feeStudent={data.student} />
                </TabsContent>
                <TabsContent value={tabs[2].value}>
                    <LibraryFinePayment feeStudent={data.student} />
                </TabsContent>
                <TabsContent value={tabs[3].value}>
                    <StudentLedgerView studentId={data.student?.id} />
                </TabsContent>
            </Tabs>

        </section>
    )
}

function StudentDetails({ feeStudent }: { feeStudent: TFeeStudent['student'] | undefined }) {
    if (!feeStudent) return null;

    return (
        <Card>
            <CardContent className="p-6 flex gap-6 items-center">
                <ProfileAvatar name={feeStudent?.name} src={getImageUrl(feeStudent?.profileImageUrl, 'w=110')} className="size-28" />
                <section className="space-y-3">
                    <section className="space-y-1">
                        <CardTitle>{feeStudent?.name}</CardTitle>
                        <CardDescription>{feeStudent.classRoomName}</CardDescription>
                    </section>
                    <section className="flex gap-24">
                        <div className="space-y-1">
                            <p>Student ID: {feeStudent.studentId}</p>
                            <p>Roll No: {feeStudent.rollNo}</p>
                        </div>

                        <div className="space-y-1">
                            <p>Phone: {feeStudent.phone}</p>
                            <p>Email: {feeStudent.email}</p>
                        </div>
                    </section>
                </section>
            </CardContent>
        </Card>
    )
}