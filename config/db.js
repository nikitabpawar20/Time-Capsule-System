const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path setup
const dbPath = path.resolve(__dirname, "../timecapsule.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

db.serialize(() => {
  // Table Creation
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient_name TEXT NOT NULL,
      message TEXT NOT NULL,
      deliver_at TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending','delivered')) DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now','localtime')),
      delivered_at TEXT
    )
  `, (err) => {
    if (err) console.error("❌ Table creation error:", err.message);
    else console.log("✅ Messages table ready");
  });

  // Index for Scheduler performance
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_status_deliver 
    ON messages (status, deliver_at)
  `);
});

module.exports = db;
