import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Smart Waste API Running ✅");
});

export default app;