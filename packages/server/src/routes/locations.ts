import express, { Request, Response } from "express";
import Locations from "../services/location-svc.js";
import { Location } from "../models/location.js";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const list: Location[] = await Locations.index();
    res.json(list);
  } catch (err) {
    res.status(500).send({ error: (err as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const location: Location = await Locations.get(req.params.id);
    res.json(location);
  } catch (err) {
    res.status(404).send({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const location: Location = await Locations.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    res.status(500).send({ error: (err as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const location: Location = await Locations.update(req.params.id, req.body);
    res.json(location);
  } catch (err) {
    res.status(404).send({ error: (err as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Locations.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(404).send({ error: (err as Error).message });
  }
});

export default router;
