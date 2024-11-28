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
import { useGetChargeHeads } from "../../data-access";
import { feeInvoiceSchemaType } from "./fee-invoice-form";

type TAdHocChargesResponse = {
    data: {
        id: string,
        name: string,
        period: EChargeHeadPeriod,
        type: EChargeHeadType,
        feeStructures: {
            amount: number
        }[]
    }[]
}

type Props = {
    classRoomId: string;
    setValue: (fs: feeInvoiceSchemaType["invoiceItems"][0]) => void
    chargeHeadIds: string[]
}

export default function AdHocChargeIncludeBtn({ classRoomId, setValue, chargeHeadIds }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCHId, setSelectedCHId] = useState<string | undefined>(undefined);
    const { data, isLoading } = useGetChargeHeads<TAdHocChargesResponse>({
        queryString: createQueryString({
            classRoomId,
            types: EChargeHeadType.Ad_Hoc,
            skipPagination: 'true',
            defaults: 'false',
        }),
        options: { enabled: isOpen }
    })

    const handleInclude = () => {
        if (!selectedCHId) return;

        const ch = data?.data?.find(ch => ch?.id === selectedCHId);

        if (!ch || chargeHeadIds.includes(ch.id)) return;

        setValue({
            amount: ch.feeStructures[0]?.amount ?? 0,
            chargeHeadId: ch.id,
            isChecked: true,
            period: ch.period,
            required: false,
            chargeHeadName: ch.name,
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
                                (data?.data ?? [])?.filter(ch => !chargeHeadIds.includes(ch?.id))?.map(option => (
                                    <SelectItem value={option.id} key={option.id}>{option?.name}</SelectItem>
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
            // disabled={(data?.data ?? [])?.filter(fs => !chargeHeadIds.includes(fs.id))?.length === 0}
            >
                <Plus />
                <span>Ad Hoc</span>
            </Button>
        </>
    )
}