import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import users from "../services/user-svc.js";

dotenv.config();
const router = express.Router();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({ username }, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err || !token) reject(err);
      else resolve(token);
    });
  });
}

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, profilePicture } = req.body;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).send("Invalid input");
    return;
  }

  try {
    const user = await users.create({
      firstName,
      lastName,
      username,
      password,
      profilePicture,
    });
    const token = await generateAccessToken(user.username);
    res.status(201).send({
      token,
      user: {
        id: user.username,
      },
    });
  } catch (err: any) {
    res.status(409).send({ error: err.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Missing username or password");
    return;
  }

  try {
    const user = await users.verify(username, password);
    const token = await generateAccessToken(user.username);
    res.status(200).send({
      token,
      user: {
        id: user.username,
      },
    });
  } catch (err: any) {
    console.error("Login failed:", err);
    res.status(401).send("Unauthorized");
  }
});

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (decoded) next();
    else res.status(403).end();
  });
}

export default router;
