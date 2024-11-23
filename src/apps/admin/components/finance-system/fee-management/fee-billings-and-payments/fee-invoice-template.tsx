import { format } from "date-fns";
import { EMonth, feeInvoiceSchemaType } from "./fee-invoice-form";
import { TFeeStudent } from "@/types/finance-system/finance.types";
import { toWords } from "@/lib/utils";
import { School } from "lucide-react";
import React from "react";

type Props = {
    invoice: feeInvoiceSchemaType;
    invoiceNo: string | null;
    grandTotal: number;
    feeStudent: TFeeStudent;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, Props>(
    ({ invoice, invoiceNo, grandTotal, feeStudent: { chargeHeads, student } }, ref) => {
        return (
            <div ref={ref} className="min-h-[297mm] w-[210mm] bg-white p-8 text-black mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="School Logo"
                        className="h-20 w-20"
                    /> */}
                        <School size={80} />

                        <div>
                            <h1 className="text-2xl font-bold">Abhyam Academy</h1>
                            <p className="text-gray-600">Comming Soon..</p>
                            <p className="text-gray-600">Phone: (123) 456-7890</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold">INVOICE</h2>
                        {invoiceNo && <p className="mt-1">Invoice #: {invoiceNo}</p>}
                    </div>
                </div>

                <hr className="border border-gray-300 mb-6" />

                {/* Dates */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <div>
                            <span className="font-semibold">Student Name: </span>
                            <span>{student.name}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Student ID: </span>
                            <span>{student.studentId}</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold">Class: </span>
                        <span>{student.classRoomName}</span>
                    </div>
                </div>
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <section>
                        <div>
                            <span className="font-semibold">Invoice Date: </span>
                            <span>{format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Due Date: </span>
                            <span>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</span>
                        </div>
                    </section>
                    <section>
                        <div>
                            <span className="font-semibold">Month Upto: </span>
                            <span>{Object.entries(EMonth).find(([_, monthInd]) => +invoice.month === +monthInd)?.[0]}</span>
                        </div>
                        {!!student.lastMonth && student.lastMonth !== '0' && <div>
                            <span className="font-semibold">Last Paid: </span>
                            <span>{Object.entries(EMonth).find(([_, monthInd]) => +student.lastMonth === +monthInd)?.[0] ?? 'N/A'}</span>
                        </div>}
                    </section>
                </div>

                {/* Table */}
                <div className="rounded-md overflow-hidden border border-gray-300">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-200">
                                <th className="py-2 pl-4 text-left">Charge Head</th>
                                <th className="py-2 text-right">Amount</th>
                                <th className="py-2 text-right">Discount (%)</th>
                                <th className="py-2 pr-4 text-right">Total</th>
                                {/* <th className="py-2 text-left">Remarks</th> */}
                            </tr>
                        </thead>
                        <tbody className="">
                            {
                                invoice.invoiceItems.map((item) => {
                                    if (!item.isChecked) return null;
                                    return <tr key={item.chargeHeadId}>
                                        <td className="py-2 pl-4">{chargeHeads.find(chargeHead => chargeHead.id === item.chargeHeadId)?.name}</td>
                                        <td className="py-2 text-right">{item.amount.toLocaleString()}</td>
                                        <td className="py-2 text-right">{item.discount}</td>
                                        <td className="py-2 pr-4 text-right">{(item.amount - (item.amount * (item.discount ?? 0) / 100)).toLocaleString()}</td>
                                        {/* <td className="py-2"></td> */}
                                    </tr>
                                })
                            }
                            {
                                student.previousDue > 0 && <tr>
                                    <td className="py-2 pl-4">Previous Due</td>
                                    <td className="py-2 text-right">{student.previousDue?.toLocaleString()}</td>
                                    <td className="py-2 text-right">-</td>
                                    <td className="py-2 pr-4 text-right">{student.previousDue?.toLocaleString()}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="mt-6">
                    <div className="flex justify-between border border-gray-300 rounded-md py-2 px-4 items-center">
                        <span className="font-semibold">Grand Total:</span>
                        <span className="text-xl font-semibold">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="mt-6 text-right">
                        <span className="text-sm font-semibold">Amount in Words: </span>
                        <span className="text-sm">
                            {toWords.convert(grandTotal, { currency: true, ignoreZeroCurrency: true })}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 flex justify-between">
                    <div>
                        <p className="font-semibold">Payment Terms:</p>
                        <p className="text-sm">Please make payment before the due date</p>
                    </div>
                    <div className="text-center">
                        <div className="mt-8 border-t border-gray-300 pt-2">
                            <p className="font-semibold">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

