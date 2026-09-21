import { AccountName } from "./transaction";

export interface AccountBalance {
  name: AccountName;
  calculatedBalance: number;
  actualBalance?: number;
  difference?: number;
  transactionCount: number;
  lastActivityDate?: string;
}

export interface AccountBalanceSummary {
  accounts: AccountBalance[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netCashFlow: number;
  budgetLimit: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetPercentage: number;
}
