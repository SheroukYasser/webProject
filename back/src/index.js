const express = require("express");
const db = require("./config/db");

const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Express server is running!");
});

// Test DB connection
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS time");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
