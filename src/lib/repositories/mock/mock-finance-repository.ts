import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilter,
  PaginatedResult,
} from "@/types/transaction";
import { AccountBalanceSummary, AccountBalance } from "@/types/account";
import { Bill, CreateBillDTO } from "@/types/bill";
import { IFinanceRepository, IBillRepository } from "../interfaces";

// Initial seed data exactly mirroring the user's InputData_Bot screenshot
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-2-2026-08-07",
    date: "2026-08-07",
    time: "14:09:58",
    sender: "R",
    activity: "Bayar tagihan untuk tes kesehatan perpanjang SIM C dengan biaya 90000 via BNI Lunas",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 90000,
    account: "BNI",
    status: "Sudah Dibayar",
    rawRowIndex: 2,
  },
  {
    id: "tx-3-2026-08-07",
    date: "2026-08-07",
    time: "14:11:13",
    sender: "R",
    activity: "Bayar tagihan perpanjangan SIM C mama Digital Korlantas sebesar 100000 via BNI lunas",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 100000,
    account: "BNI",
    status: "Sudah Dibayar",
    rawRowIndex: 3,
  },
  {
    id: "tx-4-2026-08-07",
    date: "2026-08-07",
    time: "18:01:54",
    sender: "R",
    activity: "Beli lemineral 6900 cash",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 6900,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 4,
  },
  {
    id: "tx-5-2026-08-07",
    date: "2026-08-07",
    time: "18:02:07",
    sender: "R",
    activity: "Beli tisu 6900 cash",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 6900,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 5,
  },
  {
    id: "tx-6-2026-08-07",
    date: "2026-08-07",
    time: "18:02:15",
    sender: "R",
    activity: "Beli sari roti 18000 cash",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 18000,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 6,
  },
  {
    id: "tx-7-2026-08-08",
    date: "2026-08-08",
    time: "13:17:09",
    sender: "R",
    activity: "Beli sosis kzlr keju seharga 17800 via cash",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 17800,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 7,
  },
  {
    id: "tx-8-2026-08-08",
    date: "2026-08-08",
    time: "13:17:56",
    sender: "R",
    activity: "Beli sosis kzlr hot seharga 8900 via cash",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 8900,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 8,
  },
  {
    id: "tx-9-2026-08-08",
    date: "2026-08-08",
    time: "13:18:38",
    sender: "R",
    activity: "Beli ocha green tea seharga 3700 via cash",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 3700,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 9,
  },
  {
    id: "tx-10-2026-08-08",
    date: "2026-08-08",
    time: "21:27:01",
    sender: "R",
    activity: "transfer masuk ke rekening BRI sebesar 784336",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 784336,
    account: "BRI",
    status: "Sudah Dibayar",
    rawRowIndex: 10,
  },
  {
    id: "tx-11-2026-08-08",
    date: "2026-08-08",
    time: "21:29:50",
    sender: "R",
    activity: "uang masuk ke rekening BRI sebesar 252200",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 252200,
    account: "BRI",
    status: "Sudah Dibayar",
    rawRowIndex: 11,
  },
  {
    id: "tx-12-2026-08-08",
    date: "2026-08-08",
    time: "21:46:20",
    sender: "R",
    activity: "transfer masuk 190000 ke BNI",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 190000,
    account: "BNI",
    status: "Sudah Dibayar",
    rawRowIndex: 12,
  },
  {
    id: "tx-13-2026-08-08",
    date: "2026-08-08",
    time: "21:47:02",
    sender: "R",
    activity: "uang masuk 62200 ke cash",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 62200,
    account: "Cash / Tunai",
    status: "Sudah Dibayar",
    rawRowIndex: 13,
  },
  {
    id: "tx-14-2026-08-08",
    date: "2026-08-08",
    time: "21:51:04",
    sender: "R",
    activity: "beli kemarin sebesar 252200 ke BRI sudah dibayar",
    type: "Pengeluaran",
    category: "Lain-lain",
    amount: 252200,
    account: "BRI",
    status: "Sudah Dibayar",
    rawRowIndex: 14,
  },
  {
    id: "tx-15-2026-08-08",
    date: "2026-08-08",
    time: "21:54:52",
    sender: "R",
    activity: "transfer masuk ke sea bank 94313 dibayar",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 94313,
    account: "SeaBank",
    status: "Sudah Dibayar",
    rawRowIndex: 15,
  },
  {
    id: "tx-16-2026-08-08",
    date: "2026-08-08",
    time: "21:55:39",
    sender: "R",
    activity: "transfer masuk ke gopay 22407 dibayar",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 22407,
    account: "GoPay",
    status: "Sudah Dibayar",
    rawRowIndex: 16,
  },
  {
    id: "tx-17-2026-08-08",
    date: "2026-08-08",
    time: "21:56:06",
    sender: "R",
    activity: "transfer masuk dana 64 dibayar",
    type: "Pemasukan",
    category: "Pemasukan",
    amount: 64,
    account: "DANA",
    status: "Sudah Dibayar",
    rawRowIndex: 17,
  },
];

const INITIAL_BILLS: Bill[] = [
  { id: "bill-2", name: "Wifi IndiHome", amount: 350000, dueDay: 20, status: "Upcoming", rawRowIndex: 2 },
  { id: "bill-3", name: "Listrik PLN", amount: 200000, dueDay: 25, status: "Upcoming", rawRowIndex: 3 },
  { id: "bill-4", name: "Langganan Spotify & AI", amount: 150000, dueDay: 10, status: "Overdue", rawRowIndex: 4 },
];

export class MockFinanceRepository implements IFinanceRepository, IBillRepository {
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private bills: Bill[] = [...INITIAL_BILLS];
  private budgetLimit: number = 250000;

  async getTransactions(filter?: TransactionFilter): Promise<PaginatedResult<Transaction>> {
    let result = [...this.transactions];

    // Sort descending by date & time
    result.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

    if (filter) {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        result = result.filter(
          (t) =>
            t.activity.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.account.toLowerCase().includes(q)
        );
      }
      if (filter.type && filter.type !== "ALL") {
        result = result.filter((t) => t.type === filter.type);
      }
      if (filter.account && filter.account !== "ALL") {
        result = result.filter(
          (t) => t.account.toLowerCase() === filter.account!.toLowerCase()
        );
      }
    }

    const total = result.length;
    const limit = filter?.limit || 50;
    const offset = filter?.offset || 0;
    const paginated = result.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.transactions.find((t) => t.id === id) || null;
  }

  async createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
    const now = new Date();
    const date = dto.date || now.toISOString().split("T")[0];
    const time = dto.time || now.toTimeString().split(" ")[0];
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${date}`,
      date,
      time,
      sender: dto.sender || "Web User",
      activity: dto.activity,
      type: dto.type,
      category: dto.category,
      amount: Math.abs(dto.amount),
      account: dto.account,
      status: dto.status || "Sudah Dibayar",
      source: dto.source || "web",
      rawRowIndex: this.transactions.length + 2,
    };

    this.transactions.push(newTx);
    return newTx;
  }

  async updateTransaction(id: string, dto: UpdateTransactionDTO): Promise<Transaction> {
    const idx = this.transactions.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Transaction not found");

    const existing = this.transactions[idx];
    const updated: Transaction = {
      ...existing,
      activity: dto.activity ?? existing.activity,
      type: dto.type ?? existing.type,
      category: dto.category ?? existing.category,
      amount: dto.amount !== undefined ? Math.abs(dto.amount) : existing.amount,
      account: dto.account ?? existing.account,
      status: dto.status ?? existing.status,
    };

    this.transactions[idx] = updated;
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const idx = this.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.transactions.splice(idx, 1);
    return true;
  }

  async getAccountBalances(): Promise<AccountBalanceSummary> {
    const standardAccounts = [
      "SeaBank",
      "BRI",
      "BNI",
      "DANA",
      "GoPay",
      "Krom",
      "Cash / Tunai",
    ];

    const accountMap = new Map<string, AccountBalance>();
    standardAccounts.forEach((acc) => {
      accountMap.set(acc.toLowerCase(), {
        name: acc,
        calculatedBalance: 0,
        transactionCount: 0,
      });
    });

    let totalBalance = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    this.transactions.forEach((tx) => {
      const accKey = tx.account.toLowerCase();
      let accObj = accountMap.get(accKey);
      if (!accObj) {
        accObj = {
          name: tx.account,
          calculatedBalance: 0,
          transactionCount: 0,
        };
        accountMap.set(accKey, accObj);
      }

      accObj.transactionCount += 1;

      if (tx.type === "Pemasukan") {
        accObj.calculatedBalance += tx.amount;
        totalBalance += tx.amount;
        monthlyIncome += tx.amount;
      } else {
        accObj.calculatedBalance -= tx.amount;
        totalBalance -= tx.amount;
        monthlyExpense += tx.amount;
      }
    });

    const netCashFlow = monthlyIncome - monthlyExpense;
    const budgetUsed = monthlyExpense;
    const budgetRemaining = Math.max(0, this.budgetLimit - budgetUsed);
    const budgetPercentage = this.budgetLimit > 0 ? (budgetUsed / this.budgetLimit) * 100 : 0;

    return {
      accounts: Array.from(accountMap.values()),
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      netCashFlow,
      budgetLimit: this.budgetLimit,
      budgetUsed,
      budgetRemaining,
      budgetPercentage,
    };
  }

  async reconcileAccount(accountName: string, actualBalance: number): Promise<Transaction> {
    const summary = await this.getAccountBalances();
    const acc = summary.accounts.find(
      (a) => a.name.toLowerCase() === accountName.toLowerCase()
    );
    const calculated = acc ? acc.calculatedBalance : 0;
    const diff = actualBalance - calculated;

    return await this.createTransaction({
      activity: "Penyesuaian Saldo (Adjustment)",
      type: diff > 0 ? "Pemasukan" : "Pengeluaran",
      category: "Lain-lain",
      amount: Math.abs(diff),
      account: accountName,
      status: "Sudah Dibayar",
      source: "adjustment",
    });
  }

  async getBills(): Promise<Bill[]> {
    return [...this.bills];
  }

  async createBill(dto: CreateBillDTO): Promise<Bill> {
    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      name: dto.name,
      amount: dto.amount,
      dueDay: dto.dueDay,
      status: "Upcoming",
      rawRowIndex: this.bills.length + 2,
    };
    this.bills.push(newBill);
    return newBill;
  }

  async deleteBill(id: string): Promise<boolean> {
    const idx = this.bills.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.bills.splice(idx, 1);
    return true;
  }
}
