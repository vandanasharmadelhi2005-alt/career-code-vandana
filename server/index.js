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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ message: "CareerCoded Blog API is running." });
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

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
