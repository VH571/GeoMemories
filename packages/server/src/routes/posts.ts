import express, { Request, Response } from "express";
import { Post } from "../models/post.js";
import Posts from "../services/post-svc.js";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Posts.index()
    .then((list: Post[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  Posts.get(id)
    .then((post: Post) => res.json(post))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newPost = req.body;
  Posts.create(newPost)
    .then((post: Post) => res.status(201).json(post))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newData = req.body;
  Posts.update(id, newData)
    .then((post: Post) => res.json(post))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
