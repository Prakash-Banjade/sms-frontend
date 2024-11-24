import AppForm from "@/components/forms/app-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NUMBER_REGEX_STRING } from "@/CONSTANTS";
import { useAppMutation } from "@/hooks/useAppMutation";
import { cn, toWords } from "@/lib/utils";
import { QueryKey } from "@/react-query/queryKeys";
import { EChargeHeadPeriod, TFeeStudent } from "@/types/finance-system/finance.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingButton from "@/components/forms/loading-button";
import { ArrowRight, Printer, ScrollText } from "lucide-react";
import { InvoiceTemplate } from "./fee-invoice-template";
import { useReactToPrint } from "react-to-print";

export enum EMonth {
    January = 1,
    February = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12
}

type Props = {
    feeStudent: TFeeStudent;
}

const invoiceItems = z.object({
    isChecked: z.boolean(),
    amount: z.coerce.number().nonnegative({ message: 'Amount must be a positive number' }),
    discount: z.coerce.number()
        .nonnegative({ message: "Discount must be 0 or more" })
        .max(100, { message: "Discount must be 100 or less" })
        .optional(),
    chargeHeadId: z.string().uuid(),
    remark: z.string().max(100, { message: "Max 100 characters" }).nullish(),
    required: z.boolean(),
    period: z.nativeEnum(EChargeHeadPeriod),
});

const invoiceSchema = z.object({
    invoiceDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid invoice date' }),
    dueDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid due date' }),
    month: z.nativeEnum(EMonth),
    studentId: z.string().uuid(),
    invoiceItems: z.array(invoiceItems).min(1, { message: "At least one invoice item is required" }),
});

export type feeInvoiceSchemaType = z.infer<typeof invoiceSchema>;

const formDefaultValues: Partial<feeInvoiceSchemaType> = {
    dueDate: new Date().toISOString().split("T")[0],
    invoiceDate: new Date().toISOString().split("T")[0],
}

export default function FeeInvoiceForm({ feeStudent: { chargeHeads, feeStructures, student } }: Props) {
    const [invoiceNo, setInvoiceNo] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const invoiceTemplateRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: invoiceTemplateRef });

    const initialInvoiceItems = useRef<feeInvoiceSchemaType["invoiceItems"]>(chargeHeads.map(ch => ({
        amount: feeStructures.find(fs => fs.chargeHeadId === ch.id)?.amount ?? 0,
        chargeHeadId: ch.id,
        discount: 0,
        isChecked: ch.required === 'true',
        remark: '',
        required: ch.required === 'true',
        period: ch.period,
    })));

    const form = useForm<feeInvoiceSchemaType>({
        resolver: zodResolver(invoiceSchema),
        mode: "onChange",
        defaultValues: {
            ...formDefaultValues,
            studentId: student.id,
            month: (+student.lastMonth + 1),
            invoiceItems: initialInvoiceItems.current,
        },
    });

    const grandTotal = useMemo(() => {
        return (form.watch('invoiceItems')?.reduce((acc, item) => {
            if (!item.isChecked) return acc;

            const total = +item.amount - (item.amount * (item.discount ?? 0) / 100);
            return acc + total;
        }, 0) || 0) + student.previousDue;
    }, [form.watch()])

    const { fields, update } = useFieldArray({
        name: "invoiceItems",
        control: form.control,
    })

    const { mutateAsync, isPending } = useAppMutation<feeInvoiceSchemaType, { invoiceNo: string }>();

    const onSubmit = async (values: feeInvoiceSchemaType) => {
        const checkedInvoices = values.invoiceItems.filter(item => item.isChecked);
        if (checkedInvoices.length === 0) return toast.error('No fees selected');

        const res = await mutateAsync({
            method: 'post',
            endpoint: QueryKey.FEE_INVOICES,
            data: {
                ...values,
                invoiceItems: checkedInvoices,
            },
            invalidateTags: [QueryKey.STUDENT_LEDGERS]
        });

        if (res.data?.invoiceNo) {
            setInvoiceNo(res.data.invoiceNo);
        }
    }

    const handleMonthChange = (val: string) => {
        if (val !== undefined) {
            form.setValue('month', val as unknown as EMonth);
            form.setValue('invoiceItems', [
                ...form.getValues('invoiceItems').map((item, ind) => item.period === EChargeHeadPeriod.Monthly
                    ? {
                        ...item,
                        amount: initialInvoiceItems?.current[ind]?.amount * (+val - +student.lastMonth),
                    } : item,
                )
            ])
        }
    }

    return (
        <AppForm schema={invoiceSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <section className="grid grid-cols-3 gap-6 mt-6">
                    <AppForm.DatePicker<feeInvoiceSchemaType>
                        name="invoiceDate"
                        label="Invoice Date"
                        inputClassName="py-5"
                        containerClassName="w-full"
                        required
                    />

                    <AppForm.DatePicker<feeInvoiceSchemaType>
                        name="dueDate"
                        label="Due Date"
                        inputClassName="py-5"
                        containerClassName="w-full"
                        required
                    />

                    <AppForm.Select<feeInvoiceSchemaType>
                        name="month"
                        label="Month Upto"
                        placeholder="Select month"
                        description="Select the month for the invoice upto."
                        options={
                            Object.entries(EMonth).filter(([_, value]) => +value > +student.lastMonth)
                                .map(([key, value]) => ({ label: key, value: value.toString() }))
                        }
                        required
                        value={String(form.watch('month'))}
                        onValueChange={handleMonthChange}
                    />
                </section>

                <section className="mt-5">
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-tableheader/50'>
                                <TableHead className="w-20">Include</TableHead>
                                <TableHead>Charge Head</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="w-40">Discount (%)</TableHead>
                                <TableHead className="min-w-[100px]">Total</TableHead>
                                <TableHead>Remark</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                fields.map((field, index) => (
                                    <TableRow key={field.id} className={cn('border-b', !form.getValues(`invoiceItems.${index}`).isChecked && 'opacity-50')}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`invoiceItems.${index}.isChecked`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                disabled={form.getValues(`invoiceItems.${index}`).required}
                                                                aria-disabled={form.getValues(`invoiceItems.${index}`).required}
                                                                title="Toggle"
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked)
                                                                    update(index, { ...form.getValues(`invoiceItems.${index}`), isChecked: !!checked })
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {chargeHeads.find(chargeHead => chargeHead.id === field.chargeHeadId)?.name}
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`invoiceItems.${index}.amount`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                pattern={NUMBER_REGEX_STRING}
                                                                type='number'
                                                                min={0}
                                                                step={0.01}
                                                                required
                                                                value={field.value ?? ''}
                                                                disabled={
                                                                    !form.getValues(`invoiceItems.${index}.isChecked`)
                                                                    || form.getValues(`invoiceItems.${index}`).required
                                                                    || isPending
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`invoiceItems.${index}.discount`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                pattern={NUMBER_REGEX_STRING}
                                                                type='number'
                                                                min={0}
                                                                max={100}
                                                                step={0.5}
                                                                required
                                                                value={field.value ?? ''}
                                                                onChange={e => {
                                                                    const val = Number(e.target.value);
                                                                    if (val > 100) field.onChange(100);
                                                                    else field.onChange(val);
                                                                }}
                                                                disabled={
                                                                    !form.getValues(`invoiceItems.${index}.isChecked`)
                                                                    || isPending
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {
                                                (form.watch(`invoiceItems.${index}.amount`) - (form.watch(`invoiceItems.${index}.amount`) * (form.watch(`invoiceItems.${index}.discount`) || 0) / 100)).toLocaleString()
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`invoiceItems.${index}.remark`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type='text'
                                                                value={field.value ?? ''}
                                                                disabled={
                                                                    !form.getValues(`invoiceItems.${index}.isChecked`)
                                                                    || isPending
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {
                                student.previousDue > 0 && <TableRow>
                                    <TableCell>
                                        <Checkbox checked={true} disabled={true} aria-disabled="true" />
                                    </TableCell>
                                    <TableCell>Previous Due</TableCell>
                                    <TableCell>{student.previousDue}</TableCell>
                                    <TableCell className="px-8">-</TableCell>
                                    <TableCell colSpan={2}>{student.previousDue.toLocaleString()}</TableCell>
                                </TableRow>
                            }
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="text-right">
                                    Grand Total :
                                </TableCell>
                                <TableCell>
                                    {
                                        grandTotal.toLocaleString()
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={4} className="text-right">
                                    In Words :
                                </TableCell>
                                <TableCell colSpan={2} className="max-w-40">
                                    {toWords.convert(grandTotal, { currency: true, ignoreZeroCurrency: true })}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>

                <section className="flex justify-center mt-10">
                    <ResponsiveDialog
                        isOpen={isDialogOpen}
                        setIsOpen={setIsDialogOpen}
                        title="Review Invoice"
                        className="max-w-max"
                    >
                        <ScrollArea className="max-h-[85vh] overflow-auto relative">
                            <InvoiceTemplate
                                ref={invoiceTemplateRef}
                                grandTotal={grandTotal}
                                invoice={form.getValues()}
                                invoiceNo={invoiceNo}
                                feeStudent={{ chargeHeads, feeStructures, student }}
                            />
                            <div className="fixed left-1/2 top-[95%] -translate-x-1/2 -translate-y-1/2 z-10">
                                {
                                    !invoiceNo ? (
                                        <LoadingButton
                                            isLoading={isPending}
                                            disabled={isPending}
                                            loadingText="Generating..."
                                            type="submit"
                                            onClick={form.handleSubmit(onSubmit)}
                                            className="bg-black text-white hover:bg-black/85"
                                        >
                                            <ScrollText />
                                            Generate Invoice
                                        </LoadingButton>
                                    ) : (
                                        <Button
                                            type="button"
                                            className="bg-black text-white hover:bg-black/85"
                                            onClick={() => handlePrint()}
                                        >
                                            <Printer />
                                            Print
                                        </Button>
                                    )
                                }
                            </div>
                        </ScrollArea>
                    </ResponsiveDialog>
                    <Button onClick={() => setIsDialogOpen(true)} type="button" disabled={Object.keys(form.formState.errors).length > 0}>
                        Continue <ArrowRight />
                    </Button>
                </section>
            </form>
        </AppForm>
    )
}