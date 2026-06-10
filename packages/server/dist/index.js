// src/index.ts
import fs from "node:fs/promises";
import path from "path";
import { connect } from "./services/mongo.js";
import express from "express";
import murals from "./routes/murals.js";
import auth, { authenticateUser } from "./routes/auth.js";
connect("Cluster0");
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
app.use(express.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.use("/auth", auth);
app.use("/api/murals", authenticateUser, murals);
// SPA Routes: /app/...
app.use("/app", (_req, res) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
