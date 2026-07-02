import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'chokoraa.db');

let db;

function getDb() {
  if (!db) {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS supporters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 10,
      mpesa_receipt TEXT,
      ward TEXT,
      support_status TEXT NOT NULL DEFAULT 'pending',
      checkout_request_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_supporters_phone ON supporters(phone);
    CREATE INDEX IF NOT EXISTS idx_supporters_status ON supporters(support_status);
    CREATE INDEX IF NOT EXISTS idx_supporters_checkout ON supporters(checkout_request_id);
  `);
}

export function createPendingSupporter(phone, checkoutRequestId) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO supporters (phone, checkout_request_id, support_status)
    VALUES (?, ?, 'pending')
  `);
  const result = stmt.run(phone, checkoutRequestId);
  return result.lastInsertRowid;
}

export function confirmPayment(checkoutRequestId, mpesaReceipt, amount) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE supporters
    SET support_status = 'paid', mpesa_receipt = ?, amount = ?
    WHERE checkout_request_id = ? AND support_status = 'pending'
  `);
  return stmt.run(mpesaReceipt, amount, checkoutRequestId);
}

export function updateSupporterWard(id, ward) {
  const db = getDb();
  const stmt = db.prepare(`UPDATE supporters SET ward = ? WHERE id = ?`);
  return stmt.run(ward, id);
}

export function getStats() {
  const db = getDb();

  const total = db.prepare(`
    SELECT COUNT(*) as count, SUM(amount) as raised
    FROM supporters WHERE support_status = 'paid'
  `).get();

  const today = db.prepare(`
    SELECT COUNT(*) as count
    FROM supporters
    WHERE support_status = 'paid'
      AND DATE(created_at) = DATE('now')
  `).get();

  const wards = db.prepare(`
    SELECT ward, COUNT(*) as count
    FROM supporters
    WHERE support_status = 'paid' AND ward IS NOT NULL
    GROUP BY ward
    ORDER BY count DESC
  `).all();

  return {
    total: total.count || 0,
    raised: total.raised || 0,
    today: today.count || 0,
    wards,
  };
}

export function getSupporterById(id) {
  const db = getDb();
  return db.prepare(`SELECT * FROM supporters WHERE id = ?`).get(id);
}

export function getSupporterByCheckout(checkoutRequestId) {
  const db = getDb();
  return db.prepare(`SELECT * FROM supporters WHERE checkout_request_id = ?`).get(checkoutRequestId);
}
