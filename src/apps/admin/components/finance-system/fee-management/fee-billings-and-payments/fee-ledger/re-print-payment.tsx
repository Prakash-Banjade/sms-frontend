import React, { useMemo } from "react";
import { useGetPayment } from "../../data-access";
import { Loader, Printer } from "lucide-react";
import { ReceiptTemplate } from "../fee-payment.tsx/fee-receipt-template";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

type Props = {
    paymentId: string;
}

export default function RePrintPayment({ paymentId }: Props) {
    const receiptTemplateRef = React.useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: receiptTemplateRef });

    const { data, isLoading } = useGetPayment({
        id: paymentId,
        options: { enabled: !!paymentId }
    });

    const student = useMemo(() => {
        if (!data?.student) return null;

        const rawStudent = data?.student;
        return typeof rawStudent === 'string' ? JSON.parse(rawStudent) : rawStudent;
    }, [data]);

    if (isLoading) return <div className="p-24 grid place-items-center space-y-2">
        <Loader size={44} className="animate-spin text-muted-foreground" />
        <span>Loading Invoice...</span>
    </div>;

    if (!data) return null;

    return (
        <ScrollArea className="max-h-[85vh] overflow-auto">
            <ReceiptTemplate
                ref={receiptTemplateRef}
                student={{
                    ...student,
                    previousDue: (data.feeInvoice?.ledgerItem?.ledgerAmount - data.feeInvoice?.totalAmount),
                }}
                invoice={{
                    month: data.feeInvoice?.month?.toString(),
                    totalAmount: data.feeInvoice.ledgerItem?.ledgerAmount,
                    invoiceItems: data.feeInvoice?.items?.map(item => ({
                        amount: item.amount,
                        chargeHead: item.chargeHead?.name,
                        discount: item.discount,
                        isChecked: true,
                    })) ?? [],
                    totalFeesPaid: data?.totalFeesPaid,
                }}
                receipt={{
                    paidAmount: data.amount,
                    paymentDate: data.createdAt,
                    receiptNo: data.receiptNo,
                    paymentMethod: data.paymentMethod,
                    remark: data.remark ?? '',
                    outStandingBalance: data.feeInvoice?.ledgerItem?.ledgerAmount - (data?.totalFeesPaid ?? 0),
                }}
            />

            <div className="fixed left-1/2 top-[95%] -translate-x-1/2 -translate-y-1/2 z-10">
                <Button
                    type="button"
                    className="bg-black text-white hover:bg-black/85"
                    onClick={() => handlePrint()}
                >
                    <Printer />
                    Print
                </Button>
            </div>
        </ScrollArea>
    )
}