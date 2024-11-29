import React, { useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetPayment } from "../../data-access";
import { Loader, Printer } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LibraryFineReceiptTemplate } from "../library-fine/library-fine-receipt-template";
import { Button } from "@/components/ui/button";

type Props = {
    paymentId: string
}

export default function RePrintLibraryFinePayment({ paymentId }: Props) {
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
            <LibraryFineReceiptTemplate
                ref={receiptTemplateRef}
                student={student}
                receipt={{
                    paymentDate: data.createdAt,
                    receiptNo: data.receiptNo,
                    paymentMethod: data.paymentMethod,
                    remark: data.remark ?? '',
                }}
                transactions={data.bookTransactions}
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