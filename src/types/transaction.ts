export type TransactionType = "Pemasukan" | "Pengeluaran";

export type PaymentStatus = "Sudah Dibayar" | "Belum Dibayar";

export type TransactionSource = "telegram" | "web" | "adjustment" | "import";

export type AccountName =
  | "Cash / Tunai"
  | "BRI"
  | "BNI"
  | "SeaBank"
  | "GoPay"
  | "Krom"
  | "DANA"
  | string;

export type CategoryName =
  | "Makanan & Minuman"
  | "Transportasi"
  | "Belanja"
  | "Tagihan & Utilitas"
  | "Hiburan"
  | "Pemasukan"
  | "Kesehatan"
  | "Lain-lain"
  | string;

export interface Transaction {
  id: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm:ss
  sender: string;
  activity: string;
  type: TransactionType;
  category: CategoryName;
  amount: number;
  account: AccountName;
  status: PaymentStatus;
  source?: TransactionSource;
  rawRowIndex?: number;
}

export interface CreateTransactionDTO {
  activity: string;
  type: TransactionType;
  category: CategoryName;
  amount: number;
  account: AccountName;
  status?: PaymentStatus;
  date?: string;
  time?: string;
  sender?: string;
  source?: TransactionSource;
}

export interface UpdateTransactionDTO {
  activity?: string;
  type?: TransactionType;
  category?: CategoryName;
  amount?: number;
  account?: AccountName;
  status?: PaymentStatus;
  date?: string;
  time?: string;
}

export interface TransactionFilter {
  query?: string;
  type?: TransactionType | "ALL";
  category?: string;
  account?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
