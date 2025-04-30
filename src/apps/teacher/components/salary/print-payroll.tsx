import React from "react";
import { Loader, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetSalaryPayroll } from "@/apps/admin/components/finance-system/salary-management/data-access";
import { PayrollTemplate } from "@/apps/admin/components/finance-system/salary-management/salary-payroll-and-payments/payroll/payroll-template";

type Props = {
    id: string;
}

export default function PrintPayroll({ id }: Props) {
    const invoiceTemplateRef = React.useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: invoiceTemplateRef });

    const { data, isLoading } = useGetSalaryPayroll({ id });

    if (isLoading) return <div className="p-24 grid place-items-center space-y-2">
        <Loader size={44} className="animate-spin text-muted-foreground" />
        <span>Loading Invoice...</span>
    </div>;

    if (!data) return null;

    return (
        <ScrollArea className="max-h-[85vh] overflow-auto">
            <PayrollTemplate
                data={data}
                ref={invoiceTemplateRef}
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