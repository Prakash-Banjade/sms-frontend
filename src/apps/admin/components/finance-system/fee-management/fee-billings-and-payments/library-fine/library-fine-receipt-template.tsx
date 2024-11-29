import { TFeeStudent } from "@/types/finance-system/fee-management.types";
import { format } from "date-fns";
import { School } from "lucide-react"
import React, { useMemo } from "react";
import { toWords } from "@/lib/utils";
import { EPaymentMethod } from "@/types/global.type";

type Props = {
    student: Omit<TFeeStudent['student'], 'lastMonth' | 'profileImageUrl' | 'classRoomId'> | null;
    receipt: {
        receiptNo: string | null;
        paymentDate: string;
        paymentMethod: EPaymentMethod;
        remark?: string | null;
    };
    transactions: {
        fine: number;
        bookName: string;
        overdueDays: string | number;
    }[]
}

export const LibraryFineReceiptTemplate = React.forwardRef<HTMLDivElement, Props>(
    ({ student, receipt, transactions }, ref) => {
        if (!student) return null;

        const grandTotal = useMemo(() => {
            return (transactions?.reduce((acc, item) => {
                if (!item.fine) return acc;

                const total = +item.fine;
                return acc + total;
            }, 0) || 0);
        }, [transactions])

        return (
            <div ref={ref} className="min-h-[297mm] w-[210mm] bg-white p-8 text-black mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <School size={80} />

                        <div>
                            <h1 className="text-2xl font-bold">Abhyam Academy</h1>
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
                <div className="mb-6 flex items-center justify-between">
                    <section>
                        <span className="font-semibold">Payment Date: </span>
                        <span>{format(new Date(receipt.paymentDate), 'dd/MM/yyyy')}</span>
                    </section>
                    <section>
                        <h3 className="text-lg font-medium uppercase">Library Fine</h3>
                    </section>
                </div>

                <div className="rounded-md overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left bg-gray-200 py-2 pl-4">S.N</th>
                                <th className="text-left bg-gray-200 py-2">Book Name</th>
                                <th className="text-left bg-gray-200 py-2">Overdue days</th>
                                <th className="text-left bg-gray-200 py-2 pr-4">Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.map((transaction, ind) => {
                                return (
                                    <tr key={ind}>
                                        <td className="py-2 pl-4">{ind + 1}</td>
                                        <td className="p-2">{transaction.bookName}</td>
                                        <td className="p-2">{transaction.overdueDays}</td>
                                        <td className="py-2 pr-4">Rs. {transaction.fine?.toLocaleString()}</td>
                                    </tr>
                                )
                            })}

                            <tr className="border-t border-gray-300">
                                <td colSpan={3} className="text-right p-2">
                                    Total Amount:
                                </td>
                                <td className="py-2 pr-4">Rs. {grandTotal.toLocaleString()}</td>
                            </tr>

                            <tr>
                                <td colSpan={3} className="text-right p-2">
                                    Received Amount:
                                </td>
                                <td className="py-2 pr-4">Rs. {grandTotal.toLocaleString()}</td>
                            </tr>

                            <tr>
                                <td colSpan={3} className="text-right p-2">
                                    Payment Method:
                                </td>
                                <td className="py-2 pr-4 capitalize">{receipt.paymentMethod}</td>
                            </tr>

                            <tr className="hover:bg-transparent">
                                <td colSpan={4} className="p-2 align-top">
                                    Amount in words:&nbsp;
                                    <span className="font-medium">
                                        {toWords.convert(grandTotal, { currency: true, ignoreZeroCurrency: true })}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
)