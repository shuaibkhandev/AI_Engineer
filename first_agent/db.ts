import fs from "fs";

const DB_FILE = "./db.json";

// Ensure DB exists
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ expenses: [] }, null, 2));
  }
}

// Read DB
export function readDB() {
  initDB();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

// Write DB
export function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Add expense
export function addExpenseToDB(expense: { name: string; amount: number }) {
  const db = readDB();
  db.expenses.push(expense);
  writeDB(db);

  return db;
}

// Get total
export function getTotalFromDB() {
  const db = readDB();

  const total = db.expenses.reduce(
    (acc: number, item: any) => acc + item.amount,
    0
  );

  return {
    totalExpense: total,
    count: db.expenses.length,
    expenses: db.expenses,
  };
}