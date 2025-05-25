import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Trails from "./services/trail-svc";
import Posts from "./services/post-svc";


connect("geomemories");

const app = express();
const port = process.env.PORT || 3000;
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
