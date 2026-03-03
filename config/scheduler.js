const cron = require("node-cron");
const db = require("./db");
const fs = require("fs");
const path = require("path");

console.log("✅ Scheduler service is active and watching the clock...");

// Har minute check karega
cron.schedule("* * * * *", () => {
  // Hum SQLite ke format mein current time nikal rahe hain
  const now = new Date();
  const sqliteNow = now.toISOString().replace('T', ' ').substring(0, 19); 
  const logPath = path.join(__dirname, "../delivery.log");

  // Debugging: Console mein dikhayega scheduler kab chala
  console.log(`[${new Date().toLocaleString()}] Checking for due capsules...`);

  // Query: Status 'pending' ho aur delivery time abhi se pehle ya barabar ho
  const query = `
    SELECT * FROM messages 
    WHERE status = 'pending' 
    AND datetime(deliver_at) <= datetime('now', 'localtime')
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ Critical Scheduler Error:", err.message);
      return;
    }

    if (rows && rows.length > 0) {
      rows.forEach((msg) => {
        const updateTime = new Date().toLocaleString();
        
        db.run(
          `UPDATE messages SET status = 'delivered', delivered_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [msg.id],
          (err) => {
            if (err) {
              console.error(`❌ Failed to unlock ID ${msg.id}:`, err.message);
            } else {
              const logEntry = `[${updateTime}] SUCCESS: Capsule unlocked for ${msg.recipient_name} (ID: ${msg.id})\n`;
              fs.appendFileSync(logPath, logEntry);
              console.log(`🚀 ID ${msg.id} is now UNLOCKED!`);
            }
          }
        );
      });
    }
  });
});