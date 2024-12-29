import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EChargeHeadPeriod, EChargeHeadType } from "@/types/finance-system/fee-management.types";
import { createQueryString } from "@/utils/create-query-string";
import { Check, Plus } from "lucide-react"
import { useState } from "react";
import { useGetChargeHeadOptions } from "../../data-access";
import { feeInvoiceSchemaType } from "./fee-invoice-form";

type TAdHocChargesResponse = {
    value: string,
    label: string,
    amount: number | null,
    period: EChargeHeadPeriod
}

type Props = {
    classRoomId: string;
    setValue: (fs: feeInvoiceSchemaType["invoiceItems"][0]) => void
    chargeHeadIds: string[]
}

export default function AdHocChargeIncludeBtn({ classRoomId, setValue, chargeHeadIds }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCHId, setSelectedCHId] = useState<string | undefined>(undefined);

    const { data, isLoading } = useGetChargeHeadOptions<TAdHocChargesResponse[]>({
        queryString: createQueryString({
            classRoomId,
            type: EChargeHeadType.Ad_Hoc,
            skipPagination: 'true',
            defaults: 'false',
        }),
        options: { enabled: isOpen }
    })

    const handleInclude = () => {
        if (!selectedCHId) return;

        const ch = data?.find(ch => ch.value === selectedCHId);

        if (!ch || chargeHeadIds.includes(ch.value)) return;

        setValue({
            amount: ch.amount ?? 0,
            chargeHeadId: ch.value,
            isChecked: true,
            period: ch.period,
            required: false,
            chargeHeadName: ch.label,
            discount: 0,
            remark: '',
        });

        setIsOpen(false);
    }

    return (
        <>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Include Ad Hoc Charge"
            >
                <section className="mt-4">
                    <Select onValueChange={val => setSelectedCHId(val)}>
                        <SelectTrigger disabled={isLoading}>
                            <SelectValue placeholder="Select charge" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                (data ?? [])?.filter(ch => !chargeHeadIds.includes(ch?.value))?.map(option => (
                                    <SelectItem value={option.value} key={option.value}>{option?.label}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <div className="flex justify-end">
                        <Button type="button" size={'sm'} className="mt-6" disabled={isLoading} onClick={handleInclude}>
                            <Check /> Include
                        </Button>
                    </div>
                </section>
            </ResponsiveDialog>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                <span>Ad Hoc</span>
            </Button>
        </>
    )
}