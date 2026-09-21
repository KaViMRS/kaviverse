/**
 * Security & Anti-Injection Utilities for Kaviverse
 */

/**
 * Sanitizes user input before writing to Google Sheets or CSV exports.
 * Defends against Formula Injection (CSV / Spreadsheet Injection).
 * Any string starting with =, +, -, @, \t, or \r is prepended with a single quote (')
 * so that spreadsheet engines treat it as pure string literals rather than formulas.
 */
export function sanitizeSheetCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  if (!str) return "";

  const dangerousPrefixes = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerousPrefixes.some((prefix) => str.startsWith(prefix))) {
    return `'${str}`;
  }

  return str;
}

/**
 * Builds and sanitizes a direct Telegram message link.
 * Defends against Open Redirects and Protocol Injection (e.g. javascript: URLs).
 * Only permits strictly digits for cleanChatId, topicId, and messageId.
 */
export function sanitizeTelegramUrl(
  chatId: string | number | null | undefined,
  topicId: string | number | null | undefined,
  messageId: string | number | null | undefined
): string | null {
  if (!chatId || !topicId || !messageId) return null;

  // Clean chat ID by removing "-100" or leading negative signs
  const cleanChatId = String(chatId).replace(/^-100|^-\b/g, "").trim();
  const cleanTopicId = String(topicId).trim();
  const cleanMessageId = String(messageId).trim();

  const digitsOnly = /^\d+$/;
  if (
    !digitsOnly.test(cleanChatId) ||
    !digitsOnly.test(cleanTopicId) ||
    !digitsOnly.test(cleanMessageId)
  ) {
    return null;
  }

  return `https://t.me/c/${cleanChatId}/${cleanTopicId}/${cleanMessageId}`;
}

/**
 * Validates whether an email address is in the authorized admin allowlist.
 * Ensures strict zero-trust access control.
 */
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = (process.env.ALLOWED_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // If no allowlist is configured, deny all in production or allow in local dev if configured
  if (allowlist.length === 0) {
    return false;
  }

  return allowlist.includes(email.trim().toLowerCase());
}
