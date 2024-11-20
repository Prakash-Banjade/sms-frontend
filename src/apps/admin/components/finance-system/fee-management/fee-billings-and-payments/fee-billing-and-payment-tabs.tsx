import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useGetFeeStudent } from "../../data-access";
import { TFeeStudent } from "@/types/finance-system/finance.types";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HandCoins, NotebookText, ReceiptText } from "lucide-react";

const tabs = [
    {
        value: 'invoice',
        label: 'Invoice',
        icon: ReceiptText,
        tabContent: () => <></>
    },
    {
        value: 'payment',
        label: 'Payment',
        icon: HandCoins,
        tabContent: () => <></>
    },
    {
        value: 'ledger',
        label: 'Ledger',
        icon: NotebookText,
        tabContent: () => <></>
    }
]

export default function FeeBillingAndPaymentTabs() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetFeeStudent({
        id: searchParams.get('studentID')!,
        options: {
            enabled: !!searchParams.get('studentID'),
        }
    })

    if (!searchParams.get('studentID')) return <div className="h-[400px] grid place-items-center text-muted-foreground">Enter student ID to view transactions</div>

    if (isLoading) return <div>Loading...</div>;

    if (!!searchParams.get('studentID') && !isLoading && !data) return <div className="h-[400px] grid place-items-center text-muted-foreground">No data found.</div>;

    return (
        <section className="space-y-6 mt-6">
            <StudentDetails feeStudent={data} />
            <Tabs
                defaultValue={searchParams.get('tab') || tabs[0].value}
                onValueChange={tab => setSearchParams('tab', tab)}
            >
                <TabsList className={`h-auto grid grid-cols-${tabs.length}`}>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="py-2">
                            <tab.icon size={16} className="mr-2" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                        <tab.tabContent />
                    </TabsContent>
                ))}
            </Tabs>

        </section>
    )
}

function StudentDetails({ feeStudent }: { feeStudent: TFeeStudent | undefined }) {
    const { searchParams } = useCustomSearchParams();

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
                            <p>Student ID: {searchParams.get('studentID')}</p>
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