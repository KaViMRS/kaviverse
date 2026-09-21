export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  status?: "Upcoming" | "Overdue" | "Paid";
  rawRowIndex?: number;
}

export interface CreateBillDTO {
  name: string;
  amount: number;
  dueDay: number;
}
