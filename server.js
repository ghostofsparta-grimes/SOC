const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/logs", (req, res) => {
  res.json([
    {
      type: "admin",
      author: "Admin: Cyan",
      message: "Give Warning executed",
      timestamp: Date.now()
    }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
