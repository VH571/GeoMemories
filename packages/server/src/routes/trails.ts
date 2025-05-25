import express, { Request, Response } from "express";
import Trails from "../services/trail-svc";
import { Trail } from "../models/trail";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Trails.index()
    .then((list: Trail[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  Trails.get(req.params.id)
    .then((trail: Trail) => res.json(trail))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  Trails.create(req.body)
    .then((trail: Trail) => res.status(201).json(trail))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  Trails.update(req.params.id, req.body)
    .then((trail: Trail) => res.json(trail))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  Trails.remove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
