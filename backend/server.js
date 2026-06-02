import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/config/database.js"
import http from "http"
import { initSocket } from "./src/socket/server.socket.js"


const PORT = process.env.PORT || 8000

const httpServer = http.createServer(app)
initSocket(httpServer)

connectToDB().catch((err)=>{
    console.error("mongodb connection failed : ",err)
    
})

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})