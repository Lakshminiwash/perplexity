import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/config/database.js"
import http from "http"
import { initSocket } from "./src/socket/server.socket.js"


const PORT = process.env.PORT || 3000

const httpServer = http.createServer(app)
httpServer.setsockopt = httpServer.setsockopt || function() {}

// Set SO_REUSEADDR to allow port reuse
httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Waiting 2 seconds before retry...`)
        setTimeout(() => {
            httpServer.close()
            httpServer.listen(PORT, () => {
                console.log(`server is running on port ${PORT}`)
            })
        }, 2000)
    } else {
        throw err
    }
})

initSocket(httpServer)

connectToDB().catch((err)=>{
    console.error("mongodb connection failed : ",err)
    
})

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`server is running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...')
    httpServer.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
    })
})