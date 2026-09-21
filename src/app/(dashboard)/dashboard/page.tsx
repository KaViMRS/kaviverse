import { getFinanceRepository, getFileRepository } from "@/lib/repositories/factory";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { AccountsWidget } from "@/components/dashboard/accounts-widget";
import { BudgetWidget } from "@/components/dashboard/budget-widget";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { RecentFiles } from "@/components/dashboard/recent-files";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const financeRepo = getFinanceRepository();
  const fileRepo = getFileRepository();

  const [balanceSummary, transactionsResult, filesResult] = await Promise.all([
    financeRepo.getAccountBalances(),
    financeRepo.getTransactions({ limit: 10 }),
    fileRepo.getFiles({ limit: 8 }),
  ]);

  const accountNames = balanceSummary.accounts.map((a) => a.name);

  return (
    <div className="space-y-6">
      {/* 1. Interactive Hero Banner with Quick Actions */}
      <DashboardHero accounts={accountNames} />

      {/* 2. KPI Summary Cards */}
      <KpiCards
        totalBalance={balanceSummary.totalBalance}
        monthlyIncome={balanceSummary.monthlyIncome}
        monthlyExpense={balanceSummary.monthlyExpense}
        netCashFlow={balanceSummary.netCashFlow}
      />

      {/* 3. Visual Charts, Accounts, & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cash flow chart (6 cols) */}
        <div className="lg:col-span-6">
          <CashFlowChart
            monthlyIncome={balanceSummary.monthlyIncome}
            monthlyExpense={balanceSummary.monthlyExpense}
          />
        </div>

        {/* Account balances (3 cols) */}
        <div className="lg:col-span-3">
          <AccountsWidget accounts={balanceSummary.accounts} />
        </div>

        {/* Budget usage (3 cols) */}
        <div className="lg:col-span-3">
          <BudgetWidget
            budgetLimit={balanceSummary.budgetLimit}
            budgetUsed={balanceSummary.budgetUsed}
            budgetRemaining={balanceSummary.budgetRemaining}
            budgetPercentage={balanceSummary.budgetPercentage}
          />
        </div>
      </div>

      {/* 4. Recent Activity (Transactions & Archived Files) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <RecentTransactions transactions={transactionsResult.data} />
        </div>

        <div className="lg:col-span-5">
          <RecentFiles files={filesResult.data} />
        </div>
      </div>
    </div>
  );
}
