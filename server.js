const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* TEMP in-memory logs (later → SQL) */
let logs = [
  {
    type: "admin",
    author: "Admin: Cyan",
    message: "Give Warning executed",
    timestamp: Date.now()
  }
];

/* ✅ GET logs (used by frontend) */
app.get("/logs", (req, res) => {
  res.json(logs);
});

/* ✅ POST new log (Confirm button will hit this) */
app.post("/logs", (req, res) => {
  const { type, author, message } = req.body;

  if (!type || !author || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newLog = {
    type,
    author,
    message,
    timestamp: Date.now()
  };

  logs.unshift(newLog); // newest first
  res.json({ success: true });
});

/* Health check */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
