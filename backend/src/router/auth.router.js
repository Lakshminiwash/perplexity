import { Router } from "express";
import { register,verify,login, getMe, logout } from "../controller/auth.controller.js";
import { registerValidator,loginValidator } from "../validator/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()
// /api/auth/register 
authRouter.post("/register",registerValidator,register)

// /api/auth/login 
authRouter.post("/login",loginValidator,login)

// /api/auth/getme
authRouter.get("/getme",authUser,getMe)

// /api/auth/verify-email 
authRouter.get("/verify-email",verify)

// /api/auth/logout 
authRouter.post("/logOut",logout)

export default authRouter