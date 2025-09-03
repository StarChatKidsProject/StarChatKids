// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse both JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (put your HTML/CSS/JS inside "public/")
app.use(express.static(path.join(__dirname, "public")));

// Simple database = JSON file
const DB_FILE = path.join(__dirname, "messages.json");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");

function loadMessages() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function saveMessages(messages) {
  fs.writeFileSync(DB_FILE, JSON.stringify(messages, null, 2));
}

// Get all messages
app.get("/messages", (req, res) => {
  res.json(loadMessages());
});

// Post a message
app.post("/message", (req, res) => {
  const { name, message, parent_id } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message required" });
  }

  const messages = loadMessages();
  const newMsg = {
    id: Date.now().toString(),
    name,
    message,
    parent_id: parent_id || null,
    created_at: new Date().toISOString()
  };
  messages.push(newMsg);
  saveMessages(messages);

  res.json({ success: true, message: newMsg });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
