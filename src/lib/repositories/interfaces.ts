import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilter,
  PaginatedResult,
} from "@/types/transaction";
import { AccountBalanceSummary } from "@/types/account";
import { Bill, CreateBillDTO } from "@/types/bill";
import { FileItem, CreateFileDTO, FileFilter, TagCount } from "@/types/file-item";

export interface IFinanceRepository {
  getTransactions(filter?: TransactionFilter): Promise<PaginatedResult<Transaction>>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(dto: CreateTransactionDTO): Promise<Transaction>;
  updateTransaction(id: string, dto: UpdateTransactionDTO): Promise<Transaction>;
  deleteTransaction(id: string): Promise<boolean>;
  getAccountBalances(): Promise<AccountBalanceSummary>;
  reconcileAccount(accountName: string, actualBalance: number): Promise<Transaction>;
}

export interface IBillRepository {
  getBills(): Promise<Bill[]>;
  createBill(dto: CreateBillDTO): Promise<Bill>;
  deleteBill(id: string): Promise<boolean>;
}

export interface IFileRepository {
  getFiles(filter?: FileFilter): Promise<PaginatedResult<FileItem>>;
  getFileById(id: string): Promise<FileItem | null>;
  getTags(): Promise<TagCount[]>;
  createFile(dto: CreateFileDTO): Promise<FileItem>;
}
