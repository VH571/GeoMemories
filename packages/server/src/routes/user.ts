import { Router, Request, Response } from "express";
import UserModel from "../models/user.js";

const router = Router();

router.get("/:userid", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.userid);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
