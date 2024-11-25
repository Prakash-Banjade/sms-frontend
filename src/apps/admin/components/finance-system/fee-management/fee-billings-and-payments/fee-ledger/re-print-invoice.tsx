import React, { useMemo } from "react";
import { useGetInvoice } from "../../../data-access"
import { InvoiceTemplate } from "../fee-invoice/fee-invoice-template";
import { Loader, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
    invoiceId: string;
}

export default function RePrintInvoice({ invoiceId }: Props) {
    const invoiceTemplateRef = React.useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: invoiceTemplateRef });

    const { data, isLoading } = useGetInvoice({
        id: invoiceId,
        options: { enabled: !!invoiceId }
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
            <InvoiceTemplate
                ref={invoiceTemplateRef}
                invoice={{
                    dueDate: data.dueDate,
                    invoiceDate: data.invoiceDate,
                    month: data.month,
                    invoiceNo: data.invoiceNo,
                    totalAmount: data?.ledgerItem?.ledgerAmount,
                    invoiceItems: data.items?.map(item => ({
                        amount: item.amount,
                        chargeHead: item.chargeHead.name,
                        discount: item.discount,
                        isChecked: true,
                        remark: item.remark,
                    })),
                }}
                student={{
                    ...student,
                    previousDue: data?.ledgerItem?.ledgerAmount - data.totalAmount,
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