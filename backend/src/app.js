import express from "express"
const app = express();

import authRouter from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./router/chatRoutes.js";
import cron from "node-cron"
import axios from "axios"
import path from "path"
import { fileURLToPath } from "url"


// CORS middleware configuration
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(express.static("./public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"))

// ✅ Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})


app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)

// ✅ Cron job
cron.schedule("*/14 * * * *", async () => {
    try {
        await axios.get("http://localhost:3000/api/health")
        console.log("Server pinged - staying awake")
    } catch (error) {
        console.log("Ping failed")
    }
})

export default app