// src/index.ts
import { webcrypto } from "crypto";
(globalThis as any).crypto = webcrypto;
import { connect } from "./services/mongo.ts";
import express, { Request, Response } from "express";
import murals from "./routes/murals.ts";
import auth, { authenticateUser } from "./routes/auth.ts";

connect("Cluster0");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.use("/auth", auth);
app.use("/api/murals", authenticateUser, murals);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});