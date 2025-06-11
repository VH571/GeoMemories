import express, { Request, Response } from "express";
import { connect } from "./services/mongo.js";
import Locations from "./services/location-svc.js";
import Posts from "./services/post-svc.js";
import postRoutes from "./routes/posts.js";
import locationRoutes from "./routes/locations.js"; 
import authRoutes, { authenticateUser } from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
connect("geomemories");

const app = express();
const port = process.env.PORT || 3010;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDir = process.env.STATIC
  ? path.resolve(__dirname, "../../../", process.env.STATIC)
  : path.resolve(__dirname, "../../../packages/app/dist");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

console.log("STATIC env:", process.env.STATIC);
console.log("Resolved staticDir:", staticDir);

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", authenticateUser, postRoutes);
app.use("/api/locations", authenticateUser, locationRoutes);

if (staticDir) {
  app.use(express.static(staticDir));
  app.get(/^\/(?!api\/|auth\/).*/, async (_req, res) => {
  try {
    const html = await fs.readFile(path.resolve(staticDir, "index.html"), "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error("Failed to serve fallback:", err);
    res.status(500).send("Error loading app");
  }
});
}

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
