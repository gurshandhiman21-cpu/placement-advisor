// ─────────────────────────────────────────
// Entry point — starts the Express server
// ─────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyze");

const app = express();
const PORT = 3000;

app.use(cors());

// Allows the server to read JSON from request body
app.use(express.json());

// All /analyze requests go to the analyze route file
app.use("/analyze", analyzeRoute);

// Health check — visit localhost:3000 in browser to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "Placement Advisor API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
