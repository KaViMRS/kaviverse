import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes cleanly
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into Indonesian Rupiah (IDR) currency format.
 * Example: 25000 -> "Rp 25.000"
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\u00A0/, " ");
}

/**
 * Formats numbers into compact IDR representation.
 * Example: 2500000 -> "Rp 2.5M", 75000 -> "Rp 75K"
 */
export function formatCompactIDR(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}K`;
  }
  return formatIDR(amount);
}

/**
 * Normalizes and formats a date string (handles YYYY-MM-DD or DD/MM/YYYY HH:mm:ss) into Indonesian readable date.
 */
export function formatDateIndonesian(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  try {
    let d: Date;
    if (typeof dateStr === "string") {
      // Check if it's DD/MM/YYYY HH:mm:ss format from PetugasData
      const dmYMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/);
      if (dmYMatch) {
        const day = parseInt(dmYMatch[1], 10);
        const month = parseInt(dmYMatch[2], 10) - 1;
        const year = parseInt(dmYMatch[3], 10);
        const hour = parseInt(dmYMatch[4] || "0", 10);
        const minute = parseInt(dmYMatch[5] || "0", 10);
        const second = parseInt(dmYMatch[6] || "0", 10);
        d = new Date(year, month, day, hour, minute, second);
      } else {
        d = new Date(dateStr);
      }
    } else {
      d = dateStr;
    }

    if (isNaN(d.getTime())) return String(dateStr);

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(d);
  } catch {
    return String(dateStr);
  }
}
