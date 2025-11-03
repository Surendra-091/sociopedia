const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // keep for local dev; Render provides env vars via dashboard

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

app.get("/", (req, res) => res.send("API running"));

// ---- DEBUG: print status of important env vars (do not log secrets in production) ----
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("MONGO_URL present?", !!process.env.MONGO_URL);

// ---- Connect to MongoDB (no deprecated options) ----
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is missing. Add it to Render environment variables (Settings → Environment).");
} else {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:");
      console.error(err && err.message ? err.message : err);
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
