import { getSheetsClient } from "@/lib/google/auth";
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
import { sanitizeSheetCell } from "@/lib/utils/security";

export class SheetsFinanceRepository implements IFinanceRepository, IBillRepository {
  private spreadsheetId: string;
  private budgetLimit: number;
  private rawRowsPromise: Promise<string[][]> | null = null;
  private rawRowsCachedAt = 0;
  private readonly rawRowsCacheTtl = 15_000;

  constructor() {
    this.spreadsheetId =
      process.env.FINANCE_SPREADSHEET_ID || "1Mmx6s44ZTDyK19LArBwI4oiGfmsOPPYM5VJbhgOvo0A";
    this.budgetLimit = Number(process.env.BUDGET_LIMIT) || 250000;
  }

  private async fetchRawRows(): Promise<string[][]> {
    const now = Date.now();
    if (this.rawRowsPromise && now - this.rawRowsCachedAt < this.rawRowsCacheTtl) {
      return this.rawRowsPromise;
    }

    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    this.rawRowsCachedAt = now;
    this.rawRowsPromise = sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spreadsheetId,
        range: "Input!A2:I",
      })
      .then((response) => (response.data.values as string[][]) || [])
      .catch((error) => {
        this.rawRowsPromise = null;
        this.rawRowsCachedAt = 0;
        throw error;
      });

    return this.rawRowsPromise;
  }

  private invalidateRawRowsCache() {
    this.rawRowsPromise = null;
    this.rawRowsCachedAt = 0;
  }

  async getTransactions(filter?: TransactionFilter): Promise<PaginatedResult<Transaction>> {
    const rows = await this.fetchRawRows();

    let transactions: Transaction[] = rows
      .map((row, idx) => ({ row, idx }))
      .filter(({ row }) => row && row.length > 0 && row.some((cell) => cell && String(cell).trim() !== ""))
      .map(({ row, idx }) => {
        const date = row[0] ? String(row[0]).trim() : "";
        const time = row[1] ? String(row[1]).trim() : "";
        const sender = row[2] ? String(row[2]).trim() : "User";
        const activity = row[3] ? String(row[3]).trim() : "";
        const type = (row[4] ? String(row[4]).trim() : "Pengeluaran") as "Pemasukan" | "Pengeluaran";
        const category = row[5] ? String(row[5]).trim() : "Lain-lain";
        const amount = Number(String(row[6] || "0").replace(/[^0-9.-]+/g, "")) || 0;
        const account = row[7] ? String(row[7]).trim() : "Cash / Tunai";
        const status = (row[8] ? String(row[8]).trim() : "Sudah Dibayar") as "Sudah Dibayar" | "Belum Dibayar";

        const rowIndex = idx + 2; // Row number in sheet (1-indexed, starting from A2)
        return {
          id: `tx-${rowIndex}-${date}`,
          date,
          time,
          sender,
          activity,
          type,
          category,
          amount,
          account,
          status,
          rawRowIndex: rowIndex,
        };
      });

    // Sort descending by date and time (most recent first)
    transactions.sort((a, b) => {
      const dtA = `${a.date} ${a.time}`;
      const dtB = `${b.date} ${b.time}`;
      return dtB.localeCompare(dtA);
    });

    // Apply filtering
    if (filter) {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        transactions = transactions.filter(
          (t) =>
            t.activity.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.account.toLowerCase().includes(q) ||
            t.sender.toLowerCase().includes(q)
        );
      }
      if (filter.type && filter.type !== "ALL") {
        transactions = transactions.filter((t) => t.type === filter.type);
      }
      if (filter.category && filter.category !== "ALL") {
        transactions = transactions.filter(
          (t) => t.category.toLowerCase() === filter.category!.toLowerCase()
        );
      }
      if (filter.account && filter.account !== "ALL") {
        transactions = transactions.filter(
          (t) => t.account.toLowerCase() === filter.account!.toLowerCase()
        );
      }
      if (filter.status) {
        transactions = transactions.filter((t) => t.status === filter.status);
      }
    }

    const total = transactions.length;
    const limit = filter?.limit || 50;
    const offset = filter?.offset || 0;
    const paginated = transactions.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data } = await this.getTransactions({ limit: 10000 });
    return data.find((t) => t.id === id) || null;
  }

  async createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    const now = new Date();
    const date = dto.date || now.toISOString().split("T")[0];
    const time = dto.time || now.toTimeString().split(" ")[0];
    const sender = dto.sender || "Web User";

    const cleanActivity = sanitizeSheetCell(dto.activity);
    const cleanType = sanitizeSheetCell(dto.type);
    const cleanCategory = sanitizeSheetCell(dto.category);
    const cleanAmount = Math.abs(dto.amount);
    const cleanAccount = sanitizeSheetCell(dto.account);
    const cleanStatus = sanitizeSheetCell(dto.status || "Sudah Dibayar");

    const rowValues = [
      date,
      time,
      sender,
      cleanActivity,
      cleanType,
      cleanCategory,
      cleanAmount,
      cleanAccount,
      cleanStatus,
    ];

    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: "Input!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues],
      },
    });
    this.invalidateRawRowsCache();

    const updatedRange = appendRes.data.updates?.updatedRange || "";
    const matchRow = updatedRange.match(/!A(\d+)/);
    const rowIndex = matchRow ? parseInt(matchRow[1], 10) : 999;

    return {
      id: `tx-${rowIndex}-${date}`,
      date,
      time,
      sender,
      activity: cleanActivity,
      type: dto.type,
      category: dto.category,
      amount: cleanAmount,
      account: dto.account,
      status: (dto.status as "Sudah Dibayar" | "Belum Dibayar") || "Sudah Dibayar",
      source: "web",
      rawRowIndex: rowIndex,
    };
  }

  async updateTransaction(id: string, dto: UpdateTransactionDTO): Promise<Transaction> {
    const existing = await this.getTransactionById(id);
    if (!existing || !existing.rawRowIndex) {
      throw new Error(`Transaction ${id} not found.`);
    }

    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    const updatedActivity = dto.activity !== undefined ? sanitizeSheetCell(dto.activity) : existing.activity;
    const updatedType = dto.type !== undefined ? sanitizeSheetCell(dto.type) : existing.type;
    const updatedCategory = dto.category !== undefined ? sanitizeSheetCell(dto.category) : existing.category;
    const updatedAmount = dto.amount !== undefined ? Math.abs(dto.amount) : existing.amount;
    const updatedAccount = dto.account !== undefined ? sanitizeSheetCell(dto.account) : existing.account;
    const updatedStatus = dto.status !== undefined ? sanitizeSheetCell(dto.status) : existing.status;

    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `Input!D${existing.rawRowIndex}:I${existing.rawRowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            updatedActivity,
            updatedType,
            updatedCategory,
            updatedAmount,
            updatedAccount,
            updatedStatus,
          ],
        ],
      },
    });
    this.invalidateRawRowsCache();

    return {
      ...existing,
      activity: updatedActivity,
      type: (updatedType as "Pemasukan" | "Pengeluaran"),
      category: updatedCategory,
      amount: updatedAmount,
      account: updatedAccount,
      status: (updatedStatus as "Sudah Dibayar" | "Belum Dibayar"),
    };
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const existing = await this.getTransactionById(id);
    if (!existing || !existing.rawRowIndex) {
      return false;
    }

    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    // Clear row values in sheet
    await sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range: `Input!A${existing.rawRowIndex}:I${existing.rawRowIndex}`,
    });
    this.invalidateRawRowsCache();

    return true;
  }

  async getAccountBalances(): Promise<AccountBalanceSummary> {
    const { data: transactions } = await this.getTransactions({ limit: 10000 });

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

    const currentMonth = new Date().toISOString().substring(0, 7); // yyyy-MM

    transactions.forEach((tx) => {
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
        if (tx.date.startsWith(currentMonth)) {
          monthlyIncome += tx.amount;
        }
      } else {
        accObj.calculatedBalance -= tx.amount;
        totalBalance -= tx.amount;
        if (tx.date.startsWith(currentMonth)) {
          monthlyExpense += tx.amount;
        }
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

    if (diff === 0) {
      throw new Error(`Saldo untuk rekening ${accountName} sudah sesuai (tidak ada selisih).`);
    }

    const type = diff > 0 ? "Pemasukan" : "Pengeluaran";
    const amount = Math.abs(diff);

    return await this.createTransaction({
      activity: "Penyesuaian Saldo (Adjustment)",
      type,
      category: "Lain-lain",
      amount,
      account: accountName,
      status: "Sudah Dibayar",
      source: "adjustment",
    });
  }

  // IBillRepository Implementation
  async getBills(): Promise<Bill[]> {
    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: "Tagihan!A2:C",
    });

    const rows = (response.data.values as string[][]) || [];
    const todayDate = new Date().getDate();

    return rows
      .map((row, idx) => ({ row, idx }))
      .filter(({ row }) => row && row.length > 0 && row.some((cell) => cell && String(cell).trim() !== ""))
      .map(({ row, idx }) => {
        const name = row[0] ? String(row[0]).trim() : "Tagihan Rutin";
        const amount = Number(String(row[1] || "0").replace(/[^0-9.-]+/g, "")) || 0;
        const dueDay = parseInt(String(row[2] || "1"), 10);
        const rowIndex = idx + 2;

        let status: "Upcoming" | "Overdue" | "Paid" = "Upcoming";
        if (todayDate > dueDay) {
          status = "Overdue";
        }

        return {
          id: `bill-${rowIndex}`,
          name,
          amount,
          dueDay,
          status,
          rawRowIndex: rowIndex,
        };
      });
  }

  async createBill(dto: CreateBillDTO): Promise<Bill> {
    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    const cleanName = sanitizeSheetCell(dto.name);
    const cleanAmount = Math.abs(dto.amount);
    const cleanDueDay = Math.min(31, Math.max(1, dto.dueDay));

    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: "Tagihan!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[cleanName, cleanAmount, cleanDueDay]],
      },
    });

    const updatedRange = appendRes.data.updates?.updatedRange || "";
    const matchRow = updatedRange.match(/!A(\d+)/);
    const rowIndex = matchRow ? parseInt(matchRow[1], 10) : 999;

    return {
      id: `bill-${rowIndex}`,
      name: cleanName,
      amount: cleanAmount,
      dueDay: cleanDueDay,
      status: "Upcoming",
      rawRowIndex: rowIndex,
    };
  }

  async deleteBill(id: string): Promise<boolean> {
    const bills = await this.getBills();
    const existing = bills.find((b) => b.id === id);
    if (!existing || !existing.rawRowIndex) return false;

    const sheets = getSheetsClient();
    if (!sheets) throw new Error("Google Sheets client is not configured.");

    await sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range: `Tagihan!A${existing.rawRowIndex}:C${existing.rawRowIndex}`,
    });

    return true;
  }
}
