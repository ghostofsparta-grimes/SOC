const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== FILE SETUP ===== */
const DATA_DIR = path.join(__dirname, "data");
const LOG_FILE = path.join(DATA_DIR, "logs.json");

const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "51.38.205.167",
  user: "u8308_Qm5Dxh5oda",
  password: "hrlZLv@tk7c2jo0LMjNuK.DT",
  database: "s8308_testserver",
  waitForConnections: true,
  connectionLimit: 5
});

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

  logs.unshift(newLog);
  writeLogs(logs);

  res.json({ success: true });
});

/* PLAYER LOOKUP — ADD HERE */
app.get("/player/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const [rows] = await db.query(
  `
  SELECT
    u.username,
    u.faction,
    u.factionrank,
    u.level,
    u.hours,
    u.cash,
    u.bank,
    f.name AS faction_name
  FROM users u
  LEFT JOIN factions f ON f.id = u.faction
  WHERE u.username = ?
  LIMIT 1
  `,
  [name]
);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const player = rows[0];

    res.json({
  username: player.username,
  faction_id: player.faction,
  faction_name: player.faction_name,
  factionrank: player.factionrank,
  level: player.level,
  hours: player.hours,
  cash: player.cash,
  bank: player.bank
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
