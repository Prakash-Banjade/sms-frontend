import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PayrollTemplate } from "./payroll-template";
import { TSalaryEmployee } from "@/types/finance-system/salary-management.types";
import { useGetLastPayroll } from "../../data-access";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function PayrollPrintBtn({ salaryEmployee }: { salaryEmployee: TSalaryEmployee }) {
    const [searchParams] = useSearchParams();
    const printRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const { data, isLoading } = useGetLastPayroll({
        id: salaryEmployee.employee?.id,
        options: {
            enabled: (!!salaryEmployee.employee?.id && searchParams.get('sub-tab') === 'last'),
        },
    });

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Salary Payroll',
    });

    useEffect(() => {
        if (isPrinting) handlePrint();

        return () => setIsPrinting(false);
    }, [isPrinting])

    if (isLoading) return <div>Loading...</div>;

    if (!data) return null;

    return (
        <>
            <Button
                variant={'outline'}
                type="button"
                onClick={() => setIsPrinting(true)}
            >
                <Printer /> Print
            </Button>

            {
                isPrinting && <section className="hidden sr-only print:not-sr-only print:block">
                    <PayrollTemplate
                        salaryEmployee={salaryEmployee}
                        data={data}
                        ref={printRef}
                    />
                </section>
            }
        </>
    )
}