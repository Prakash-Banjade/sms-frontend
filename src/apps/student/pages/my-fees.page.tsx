import StudentLedgerView from "@/apps/admin/components/finance-system/fee-management/fee-billings-and-payments/fee-ledger/student-ledger-view";
import { TStudentFeeStatistics } from "@/apps/admin/types/finance-system/fee-management.types";
import DashboardCountCard from "@/components/dashboard/dashboard-count-card";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { format } from "date-fns";
import { NotepadText, Wallet, WalletMinimal } from "lucide-react";

export default function MyFeesPage() {
  const { data, isLoading } = useFetchData<TStudentFeeStatistics>({
    queryKey: [QueryKey.STUDENT_LEDGERS, 'statistics'],
    endpoint: QueryKey.STUDENT_LEDGERS + '/statistics',
  });

  return (
    <ContainerLayout
      title="My Fees"
      description="View and manage your school fees"
    >

      <section className="@container">
        <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-4">
          <DashboardCountCard
            title="Current Due Amount"
            count={`Rs. ${(data?.studentLedger?.amount || 0).toLocaleString()}`}
            classNames={{ count: data?.studentLedger?.amount === 0 ? 'text-success' : 'text-destructive' }}
            icon={Wallet}
            footer={data?.lastInvoice ? `Due by ${format(data?.lastInvoice?.dueDate, "dd MMM yyyy")}` : undefined}
            isLoading={isLoading}
          />
          <DashboardCountCard
            title="Last Invoice"
            count={`Rs. ${(data?.lastInvoice?.totalAmount || 0).toLocaleString()}`}
            icon={NotepadText}
            footer={data?.lastInvoice ? `Invoice ${data?.lastInvoice?.invoiceNo}` : undefined}
            isLoading={isLoading}
          />
          <DashboardCountCard
            title="Last Payment Made"
            count={`Rs. ${(data?.lastPayment?.amount || 0).toLocaleString()}`}
            classNames={{ count: 'text-success' }}
            icon={WalletMinimal}
            footer={data?.lastPayment ? `Paid on ${data?.lastPayment?.receiptNo}` : undefined}
            isLoading={isLoading}
          />
        </div>
      </section>

      <h2 className="mt-10 text-2xl font-semibold">My Ledger History</h2>

      <StudentLedgerView className="mt-2" />

    </ContainerLayout>
  )
}