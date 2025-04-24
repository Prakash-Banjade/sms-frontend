import StudentLedgerView from "@/apps/admin/components/finance-system/fee-management/fee-billings-and-payments/fee-ledger/student-ledger-view";
import DashboardCountCard from "@/components/dashboard/dashboard-count-card";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { NotepadText, Wallet, WalletMinimal } from "lucide-react";

export default function MyFeesPage() {
  return (
    <ContainerLayout
      title="My Fees"
      description="View and manage your school fees"
    >

      <section className="@container">
        <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-4">
          <DashboardCountCard
            title="Current Due Amount"
            count={'Rs. 12,600'}
            classNames={{ count: 'text-destructive' }}
            icon={Wallet}
            footer="Due by May 15, 2025"
          />
          <DashboardCountCard
            title="Last Invoice"
            count={'Rs. 8,600'}
            icon={NotepadText}
            footer="Invoice #INV-2025-001"
          />
          <DashboardCountCard
            title="Last Payment Made"
            count={'Rs. 2,000'}
            classNames={{ count: 'text-success' }}
            icon={WalletMinimal}
            footer="Paid on May 15, 2025"
          />
        </div>
      </section>

      <h2 className="mt-10 text-2xl font-semibold">My Ledger History</h2>

      <StudentLedgerView className="mt-2" />

    </ContainerLayout>
  )
}