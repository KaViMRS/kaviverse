"use client";

import * as React from "react";
import {
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatIDR } from "@/lib/utils/formatters";
import { ExportCsvButton } from "./export-csv-button";
import { TransactionFormModal } from "./transaction-form-modal";
import { TransactionDetailDrawer } from "./transaction-detail-drawer";
import { TransactionEditModal } from "./transaction-edit-modal";
import { useRouter } from "next/navigation";

interface TransactionTableInteractiveProps {
  initialTransactions: Transaction[];
  availableAccounts?: string[];
}

export function TransactionTableInteractive({
  initialTransactions,
  availableAccounts = [],
}: TransactionTableInteractiveProps) {
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState("");
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const [typeFilter, setTypeFilter] = React.useState<"ALL" | "Pengeluaran" | "Pemasukan">("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [accountFilter, setAccountFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Modals & Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedTxForDetail, setSelectedTxForDetail] = React.useState<Transaction | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [selectedTxForEdit, setSelectedTxForEdit] = React.useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Extract unique categories & accounts for filter dropdowns
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    initialTransactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [initialTransactions]);

  const accounts = React.useMemo(() => {
    const set = new Set<string>(availableAccounts);
    initialTransactions.forEach((t) => {
      if (t.account) set.add(t.account);
    });
    return Array.from(set).sort();
  }, [initialTransactions, availableAccounts]);

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    return initialTransactions.filter((tx) => {
      // Search query
      if (deferredSearchQuery.trim()) {
        const q = deferredSearchQuery.toLowerCase();
        const matchesActivity = tx.activity.toLowerCase().includes(q);
        const matchesCategory = tx.category.toLowerCase().includes(q);
        const matchesAccount = tx.account.toLowerCase().includes(q);
        const matchesSender = (tx.sender || "").toLowerCase().includes(q);
        if (!matchesActivity && !matchesCategory && !matchesAccount && !matchesSender) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== "ALL" && tx.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "ALL" && tx.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Account filter
      if (accountFilter !== "ALL" && tx.account.toLowerCase() !== accountFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== "ALL" && tx.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [initialTransactions, deferredSearchQuery, typeFilter, categoryFilter, accountFilter, statusFilter]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, categoryFilter, accountFilter, statusFilter]);

  // Pagination Slice
  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  const totalCount = initialTransactions.length;
  const expenseCount = initialTransactions.filter((t) => t.type === "Pengeluaran").length;
  const incomeCount = initialTransactions.filter((t) => t.type === "Pemasukan").length;

  function handleRowClick(tx: Transaction) {
    setSelectedTxForDetail(tx);
    setIsDetailDrawerOpen(true);
  }

  function handleOpenEdit(tx: Transaction) {
    setIsDetailDrawerOpen(false);
    setSelectedTxForEdit(tx);
    setIsEditModalOpen(true);
  }

  function handleMutationSuccess() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Top Action Bar & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi, kategori, atau rekening..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-text-primary placeholder:text-text-muted/70 transition-all outline-none"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(25, 197, 158, 0.4)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <ExportCsvButton />
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #19C59E 0%, #108e71 100%)",
              boxShadow: "0 4px 18px -4px rgba(25, 197, 158, 0.45)",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Type Pills & Dropdowns */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 pt-1">
        {/* Type Pills */}
        <div className="grid grid-cols-3 gap-1.5 w-full sm:flex sm:items-center sm:w-auto sm:gap-2">
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className="px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap"
            style={{
              background:
                typeFilter === "ALL"
                  ? "rgba(25, 197, 158, 0.15)"
                  : "rgba(14, 20, 32, 0.6)",
              border:
                typeFilter === "ALL"
                  ? "1px solid rgba(25, 197, 158, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
              color: typeFilter === "ALL" ? "#19C59E" : "#8B95A7",
            }}
          >
            Semua ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("Pengeluaran")}
            className="px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap"
            style={{
              background:
                typeFilter === "Pengeluaran"
                  ? "rgba(244, 63, 94, 0.15)"
                  : "rgba(14, 20, 32, 0.6)",
              border:
                typeFilter === "Pengeluaran"
                  ? "1px solid rgba(244, 63, 94, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
              color: typeFilter === "Pengeluaran" ? "#FB7185" : "#8B95A7",
            }}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-rose-400" />
            <span>Pengeluaran ({expenseCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("Pemasukan")}
            className="px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap"
            style={{
              background:
                typeFilter === "Pemasukan"
                  ? "rgba(25, 197, 158, 0.15)"
                  : "rgba(14, 20, 32, 0.6)",
              border:
                typeFilter === "Pemasukan"
                  ? "1px solid rgba(25, 197, 158, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
              color: typeFilter === "Pemasukan" ? "#19C59E" : "#8B95A7",
            }}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
            <span>Pemasukan ({incomeCount})</span>
          </button>
        </div>

        {/* Secondary Select Dropdowns */}
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs rounded-xl text-text-secondary cursor-pointer outline-none transition-all"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Account Dropdown */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs rounded-xl text-text-secondary cursor-pointer outline-none transition-all"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <option value="ALL">Semua Rekening</option>
            {accounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs rounded-xl text-text-secondary cursor-pointer outline-none transition-all"
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <option value="ALL">Semua Status</option>
            <option value="Sudah Dibayar">Sudah Dibayar</option>
            <option value="Belum Dibayar">Belum Dibayar</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(14, 20, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.35)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <th className="py-3.5 px-4">Tanggal &amp; Waktu</th>
                <th className="py-3.5 px-4">Deskripsi Transaksi</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Rekening</th>
                <th className="py-3.5 px-4 text-right">Nominal</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs text-text-primary">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-text-muted">
                    <p className="font-bold text-sm text-text-primary">Tidak ada transaksi yang cocok.</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isIncome = tx.type === "Pemasukan";
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => handleRowClick(tx)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* Tanggal & Waktu */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                          <Calendar className="w-3.5 h-3.5 text-text-muted/70 shrink-0" />
                          <span>{tx.date}</span>
                        </div>
                        <div className="text-[10px] text-text-muted pl-5">{tx.time}</div>
                      </td>

                      {/* Deskripsi */}
                      <td className="py-3 px-4 font-semibold max-w-xs md:max-w-md truncate">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isIncome ? "bg-accent shadow-xs" : "bg-rose-400 shadow-xs"
                            }`}
                            style={{
                              boxShadow: isIncome
                                ? "0 0 6px rgba(25, 197, 158, 0.6)"
                                : "0 0 6px rgba(244, 63, 94, 0.6)",
                            }}
                          />
                          <span className="truncate group-hover:text-accent transition-colors">
                            {tx.activity}
                          </span>
                        </div>
                        {tx.sender && (
                          <div className="text-[10px] text-text-muted pl-4">
                            Oleh: {tx.sender}
                          </div>
                        )}
                      </td>

                      {/* Kategori */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-text-secondary"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.07)",
                          }}
                        >
                          {tx.category}
                        </span>
                      </td>

                      {/* Rekening */}
                      <td className="py-3 px-4 whitespace-nowrap text-text-secondary font-semibold">
                        {tx.account}
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-4 whitespace-nowrap text-right font-black tracking-tight">
                        <span className={isIncome ? "text-accent" : "text-text-primary"}>
                          {isIncome ? "+" : "-"} {formatIDR(tx.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{
                            background:
                              tx.status === "Sudah Dibayar"
                                ? "rgba(59, 130, 246, 0.12)"
                                : "rgba(245, 158, 11, 0.12)",
                            color:
                              tx.status === "Sudah Dibayar" ? "#60A5FA" : "#FBBF24",
                            borderColor:
                              tx.status === "Sudah Dibayar"
                                ? "rgba(59, 130, 246, 0.3)"
                                : "rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>

                      {/* Detail Button */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(tx);
                          }}
                          className="p-1.5 rounded-lg text-text-muted hover:text-accent transition-colors inline-flex items-center justify-center"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                          }}
                          title="Lihat detail & kelola"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 text-xs text-text-muted"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(255, 255, 255, 0.015)",
            }}
          >
            <div>
              Menampilkan{" "}
              <span className="font-bold text-text-primary">{startIndex + 1}</span> -{" "}
              <span className="font-bold text-text-primary">
                {Math.min(startIndex + pageSize, totalItems)}
              </span>{" "}
              dari <span className="font-bold text-text-primary">{totalItems}</span> transaksi
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span
                className="text-xs px-2.5 py-0.5 rounded-lg font-bold text-accent"
                style={{
                  background: "rgba(25, 197, 158, 0.1)",
                  border: "1px solid rgba(25, 197, 158, 0.2)",
                }}
              >
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer
        transaction={selectedTxForDetail}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedTxForDetail(null);
        }}
        onEdit={handleOpenEdit}
        onDeleted={handleMutationSuccess}
      />

      {/* Transaction Edit Modal */}
      <TransactionEditModal
        transaction={selectedTxForEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTxForEdit(null);
        }}
        onSuccess={handleMutationSuccess}
        availableAccounts={accounts}
      />

      {/* Transaction Add Modal */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleMutationSuccess}
        availableAccounts={accounts}
      />
    </div>
  );
}
