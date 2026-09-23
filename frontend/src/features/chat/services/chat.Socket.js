import { io } from "socket.io-client";

export const initializeSocketConnection = ()=>{
    const socket = io("https://perplexity-4d0u.onrender.com/",{
        withCredentials:true
    })

    socket.on("connected",()=>{
        console.log("connected to Socket.IO server")
    })
}