import { Button } from "@/components/ui/button";
import { LoaderCircle, Printer } from "lucide-react";
import { PayrollTemplate } from "./payroll-template";
import { TSinglePayroll } from "@/apps/admin/types/finance-system/salary-management.types";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

type Props = {
    data: TSinglePayroll | undefined,
    isLoading: boolean,
}

export default function PayrollPrintBtn({ data, isLoading }: Props) {
    const printRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Salary Payroll',
    });

    useEffect(() => {
        if (isPrinting) handlePrint();

        return () => setIsPrinting(false);
    }, [isPrinting])

    return (
        <>
            <Button
                variant={'outline'}
                type="button"
                onClick={() => setIsPrinting(true)}
            >
                {
                    isLoading ? (
                        <>
                            <LoaderCircle className="animate-spin" /> Loading...
                        </>
                    ) : (
                        <>
                            <Printer /> Print
                        </>
                    )
                }
            </Button>

            {
                isPrinting && <section className="hidden sr-only print:not-sr-only print:block">
                    <PayrollTemplate
                        data={data}
                        ref={printRef}
                    />
                </section>
            }
        </>
    )
}