// src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, specs } from "./swagger.js";

// Import routes
import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";
import healthRoutes from "./routes/health.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: process.env.WEBAPP_ORIGIN || true,
}));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api", authRoutes);
app.use("/api/user", watchlistRoutes);
app.use("/", healthRoutes);

// start server
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Server listening on ${port}`));
