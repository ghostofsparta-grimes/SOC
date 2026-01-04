const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== FILE SETUP ===== */
const DATA_DIR = path.join(__dirname, "data");
const LOG_FILE = path.join(DATA_DIR, "logs.json");

/* Ensure data folder + file exist */
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ===== HELPERS ===== */
function readLogs() {
  try {
    const data = fs.readFileSync(LOG_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

/* ===== ROUTES ===== */

/* Health check */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* GET logs */
app.get("/logs", (req, res) => {
  const logs = readLogs();
  res.json(logs);
});

/* POST new log */
app.post("/logs", (req, res) => {
  const { type, author, message } = req.body;

  if (!type || !author || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const logs = readLogs();

  const newLog = {
    type,
    author,
    message,
    timestamp: Date.now()
  };

  logs.unshift(newLog); // newest first
  writeLogs(logs);

  res.json({ success: true });
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
