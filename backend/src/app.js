import express from "express"
import authRouter from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./router/chatRoutes.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"https://perplexity-frontend-five.vercel.app/login",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}))



app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)

export default app