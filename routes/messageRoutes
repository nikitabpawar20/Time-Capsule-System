const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * @route   POST /messages/send
 */
router.post("/send", (req, res) => {
  const { recipient_name, message, deliver_at } = req.body;

  if (!recipient_name || !message || !deliver_at) {
    return res.status(400).json({ error: "Sabhi fields bharna zaroori hai!" });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: "Message 500 characters se chota hona chahiye." });
  }

  const deliveryTime = new Date(deliver_at);
  const now = new Date();

  if (deliveryTime <= now) {
    return res.status(400).json({ error: "Delivery time future ka hona chahiye." });
  }

  const query = `
    INSERT INTO messages (recipient_name, message, deliver_at, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.run(query, [recipient_name, message, deliver_at], function (err) {
    if (err) {
      console.error("❌ DB Insert Error:", err.message);
      return res.status(500).json({ error: "Database internal error." });
    }
    res.status(201).json({
      success: true,
      message: "Message successfully buried! ✅",
      id: this.lastID,
    });
  });
});

/**
 * @route   GET /messages/delivered
 */
router.get("/delivered", (req, res) => {
  // Yahan humne query ko aur strong kiya hai 'localtime' handle karne ke liye
  const query = `
    SELECT id, recipient_name, message, deliver_at, delivered_at 
    FROM messages 
    WHERE status = 'delivered' 
    OR datetime(deliver_at) <= datetime('now', 'localtime')
    ORDER BY datetime(deliver_at) DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ DB Fetch Error:", err.message);
      return res.status(500).json({ error: "Database fetch error." });
    }
    // Debugging ke liye console pe dekho data aa raha hai ya nahi
    console.log(`Fetched ${rows.length} unlocked messages`);
    res.json(rows);
  });
});

module.exports = router;
