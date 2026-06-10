// src/index.ts
import { webcrypto } from "crypto";
globalThis.crypto = webcrypto;
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
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
