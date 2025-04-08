import { format } from "date-fns";
import { TFeeStudent } from "@/types/finance-system/fee-management.types";
import { School } from "lucide-react";
import React from "react";
import { paymentSchemaType } from "./fee-payment-form";
import { EMonth } from "../fee-invoice/fee-invoice-form";

type Props = {
    receipt: Omit<paymentSchemaType, "feeInvoiceId"> & {
        receiptNo: string | null;
        paymentDate: string;
        outStandingBalance: number;
    };
    invoice: {
        month: string,
        totalAmount: number, // this is the amount including the previous due
        totalFeesPaid: number | null;
        invoiceItems: {
            amount: number;
            discount?: number;
            chargeHead: string | undefined;
        }[];
    }
    student: Omit<TFeeStudent['student'], 'lastMonth' | 'profileImageUrl' | 'classRoomId'> | null;
}

export const ReceiptTemplate = React.forwardRef<HTMLDivElement, Props>(
    ({ receipt, student, invoice }, ref) => {

        if (!student) return null;

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
                            <h1 className="text-2xl font-bold">Abhyam SMS</h1>
                            <p className="text-gray-600">Comming Soon..</p>
                            <p className="text-gray-600">Phone: (123) 456-7890</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold">PAYMENT RECEIPT</h2>
                        {receipt.receiptNo && <p className="mt-1">Receipt #: {receipt.receiptNo}</p>}
                    </div>
                </div>

                <hr className="border border-gray-300 mb-6" />

                {/* student data */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <div>
                            <span className="font-semibold">Student ID: </span>
                            <span>{student.studentId}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Student Name: </span>
                            <span>{student.name}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-semibold">Class: </span>
                        <span>{student.classRoomName}</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <section>
                        <div>
                            <span className="font-semibold">Payment Date: </span>
                            <span>{format(new Date(receipt.paymentDate), 'dd/MM/yyyy')}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Month Upto: </span>
                            <span>{Object.entries(EMonth).find(([_, monthInd]) => +invoice.month === +monthInd)?.[0]}</span>
                        </div>
                    </section>
                    <section className="text-right">
                        {/* {!!student.lastMonth && student.lastMonth !== '0' && <div>
                            <span className="font-semibold">Last Paid: </span>
                            <span>{Object.entries(EMonth).find(([_, monthInd]) => +student.lastMonth === +monthInd)?.[0] ?? 'N/A'}</span>
                        </div>} */}
                    </section>
                </div>

                {/* Table */}
                <div className="rounded-md overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-200">
                                <th className="py-2 pl-4 text-left">S.N</th>
                                <th className="py-2 text-left">Charge Head</th>
                                <th className="py-2 text-right">Amount</th>
                                <th className="py-2 text-right">Discount (%)</th>
                                <th className="py-2 pr-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {
                                invoice.invoiceItems.map((item, ind) => {
                                    return <tr key={ind}>
                                        <td className="py-2 pl-4">{ind + 1}</td>
                                        <td className="py-2">{item.chargeHead}</td>
                                        <td className="py-2 text-right">{item.amount.toLocaleString()}</td>
                                        <td className="py-2 text-right">{item.discount}</td>
                                        <td className="py-2 pr-4 text-right">{(item.amount - (item.amount * (item.discount ?? 0) / 100)).toLocaleString()}</td>
                                    </tr>
                                })
                            }
                            {
                                student.previousDue > 0 && <tr>
                                    <td className="py-2 pl-4">{invoice.invoiceItems.length + 1}</td>
                                    <td className="py-2">Previous Due</td>
                                    <td className="py-2 text-right">{student.previousDue?.toLocaleString()}</td>
                                    <td className="py-2 text-right">-</td>
                                    <td className="py-2 pr-4 text-right">{student.previousDue?.toLocaleString()}</td>
                                </tr>
                            }

                            <tr className="border-t border-gray-300">
                                <td className="text-right pt-3" colSpan={4}>Total:</td>
                                <td className="text-right pr-4">{(invoice.totalAmount)?.toLocaleString()}</td>
                            </tr>
                            {
                                !!invoice.totalFeesPaid && <tr>
                                    <td className="text-right" colSpan={4}>Prior Payments:</td>
                                    <td className="text-right pr-4">{(invoice.totalFeesPaid ?? 0)?.toLocaleString()}</td>
                                </tr>
                            }
                            <tr>
                                <td className="text-right" colSpan={4}>Outstanding Balance:</td>
                                <td className="text-right pr-4">{(receipt.outStandingBalance)?.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="text-right" colSpan={4}>Paid Amount:</td>
                                <td className="text-right pr-4">{(+receipt.paidAmount)?.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="text-right" colSpan={4}>Remaining Due:</td>
                                <td className="text-right pr-4">{(receipt.outStandingBalance - receipt.paidAmount)?.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-16 flex justify-between">
                    <section>
                        <div>
                            <span className="font-semibold">Payment Method: </span>
                            <span className="text-sm capitalize">{receipt.paymentMethod}</span>
                        </div>
                        {!!receipt.remark && <div>
                            <p className="font-semibold">Remarks:</p>
                            <p className="text-sm">{receipt.remark}</p>
                        </div>}
                    </section>
                    <div className="text-center">
                        <div className="mt-8 border-t border-gray-300 pt-2">
                            <p className="font-semibold">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

