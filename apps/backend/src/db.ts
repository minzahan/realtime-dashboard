import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../mock-db.json");

export type Transaction = {
  name: string;
  amount: number;
  currency: string;
  date: string;
};

export async function getAllTransactions(): Promise<Transaction[]> {
  const file = await fs.readFile(DB_PATH, "utf-8");
  const data = JSON.parse(file);
  return data.transactions || [];
}

export async function saveTransaction(tx: Transaction): Promise<void> {
  const current = await getAllTransactions();
  current.push(tx);
  await fs.writeFile(
    DB_PATH,
    JSON.stringify({ transactions: current }, null, 2)
  );
}
