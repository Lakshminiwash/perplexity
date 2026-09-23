import express from "express"
const app = express();

import authRouter from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./router/chatRoutes.js";
import cron from "node-cron"
import axios from "axios"

const allowedOrigins = [
    "https://perplexity-kappa-brown.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
].filter(Boolean)

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
            return
        }

        callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// app.use(express.static("./public"))
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


export default app