import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { seedDatabase } from "./utils/seedAdmin.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");
let isDatabaseConnected = false;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    message: "CareerCoded Blog API is running.",
    database: isDatabaseConnected ? "connected" : "disconnected"
  });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/health" || isDatabaseConnected) return next();
  return res.status(503).json({
    message: "Database is not connected yet. Check MongoDB environment variables in Railway."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);

app.use(express.static(clientDistPath));

app.get("*", (_req, res, next) => {
  res.sendFile(clientIndexPath, (error) => {
    if (error) next(error);
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB()
    .then(() => {
      isDatabaseConnected = true;
      if (process.env.SEED_ON_START !== "false") {
        return seedDatabase();
      }
    })
    .catch((error) => {
      isDatabaseConnected = false;
      console.error("MongoDB connection failed:", error.message);
    });
});
