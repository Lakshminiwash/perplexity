import express from "express"
import authRouter from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./router/chatRoutes.js";
import cron from "node-cron"
import axios from "axios"

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"https://perplexity-frontend-five.vercel.app",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}))

// ✅ Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})


app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)

// ✅ Cron job
cron.schedule("*/14 * * * *", async () => {
    try {
        await axios.get("https://perplexity-backend-8zm6.onrender.com/api/health")
        console.log("Server pinged - staying awake")
    } catch (error) {
        console.log("Ping failed")
    }
})

export default app