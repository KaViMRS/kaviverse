import { getFinanceRepository } from "@/lib/repositories/factory";
import { TransactionTableInteractive } from "@/components/finance/transaction-table-interactive";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const financeRepo = getFinanceRepository();
  const [{ data: transactions }, balanceSummary] = await Promise.all([
    financeRepo.getTransactions({ limit: 500 }),
    financeRepo.getAccountBalances(),
  ]);

  const availableAccounts = balanceSummary.accounts.map((a) => a.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-text-primary tracking-tight">
          Riwayat Seluruh Transaksi
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Daftar seluruh transaksi yang tercatat via Telegram dan website. Gunakan filter, pencarian, dan pagination untuk navigasi.
        </p>
      </div>

      <TransactionTableInteractive
        initialTransactions={transactions}
        availableAccounts={availableAccounts}
      />
    </div>
  );
}
