import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Trails from "./services/trail-svc";
import Posts from "./services/post-svc";
import posts from "./routes/posts";
import trails from "./routes/trails";


connect("geomemories");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.use(express.json());

app.use("/api/trails", trails);
app.use("/api/posts", posts);

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


app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
