import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Trails from "./services/trail-svc";
import Posts from "./services/post-svc";
import posts from "./routes/posts";
import trails from "./routes/trails";
import auth, { authenticateUser } from "./routes/auth";
import cors from "cors";

connect("geomemories");

const app = express();
const port = process.env.PORT || 3010;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use("/auth", auth);
app.use("/api/posts", authenticateUser, posts);
app.use("/api/trails", authenticateUser, trails);

app.get("/trails", async (req: Request, res: Response) => {
  const data = await Trails.index();
  res.json(data);
});

app.get("/trail/:id", async (req: Request, res: Response) => {
  try {
    const data = await Trails.get(req.params.id);
    res.json(data);
  } catch {
    res.status(404).send();
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  const data = await Posts.index();
  res.json(data);
});

app.get("/post/:id", async (req: Request, res: Response) => {
  try {
    const data = await Posts.get(req.params.id);
    res.json(data);
  } catch {
    res.status(404).send();
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
