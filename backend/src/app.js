import express from "express";
import cors from "cors";
import binRoutes from "./modules/bin/bin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/bins", binRoutes);

app.get("/", (req, res) => {
  res.send("Smart Waste API Running 🚀");
});

export default app;