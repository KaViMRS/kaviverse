import { IFinanceRepository, IFileRepository, IBillRepository } from "./interfaces";
import { SheetsFinanceRepository } from "./sheets/sheets-finance-repository";
import { SheetsFileRepository } from "./sheets/sheets-file-repository";
import { MockFinanceRepository } from "./mock/mock-finance-repository";
import { MockFileRepository } from "./mock/mock-file-repository";

let mockFinanceInstance: MockFinanceRepository | null = null;
let mockFileInstance: MockFileRepository | null = null;
let sheetsFinanceInstance: SheetsFinanceRepository | null = null;
let sheetsFileInstance: SheetsFileRepository | null = null;

export function getFinanceRepository(): IFinanceRepository & IBillRepository {
  const provider = process.env.DATA_SOURCE_PROVIDER || "mock";

  if (provider === "sheets" && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    if (!sheetsFinanceInstance) {
      sheetsFinanceInstance = new SheetsFinanceRepository();
    }
    return sheetsFinanceInstance;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Finance data provider is not configured for production.");
  }

  // Fallback to mock for seamless local development
  if (!mockFinanceInstance) {
    mockFinanceInstance = new MockFinanceRepository();
  }
  return mockFinanceInstance;
}

export function getFileRepository(): IFileRepository {
  const provider = process.env.DATA_SOURCE_PROVIDER || "mock";

  if (provider === "sheets" && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    if (!sheetsFileInstance) {
      sheetsFileInstance = new SheetsFileRepository();
    }
    return sheetsFileInstance;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("File data provider is not configured for production.");
  }

  // Fallback to mock for seamless local development
  if (!mockFileInstance) {
    mockFileInstance = new MockFileRepository();
  }
  return mockFileInstance;
}
