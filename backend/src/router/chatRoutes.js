import {Router} from "express"
import { authUser } from "../middleware/auth.middleware.js"
import { deleteChat, getChats, getMessages, sendMessage } from "../controller/chat.Controller.js"

const chatRouter = Router()

// /api/chat/message 
chatRouter.post("/message",authUser,sendMessage)

// /api/chat
chatRouter.get("/",authUser,getChats)

// /api/chat/getMessages 
chatRouter.get("/:chatId/messages",authUser,getMessages)

// /api/chat/deleteChat
chatRouter.delete("/delete/:chatId",authUser,deleteChat)

export default chatRouter