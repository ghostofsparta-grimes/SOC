const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let logs = [
  {
    type: "admin",
    author: "Admin: Cyan",
    message: "Give Warning executed",
    timestamp: Date.now()
  }
];

app.get("/logs", (req, res) => {
  res.json(logs);
});

app.post("/logs", (req, res) => {
  const { type, author, message } = req.body;

  if (!type || !author || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const log = {
    type,
    author,
    message,
    timestamp: Date.now()
  };

  logs.unshift(log);
  console.log("New log:", log);

  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
