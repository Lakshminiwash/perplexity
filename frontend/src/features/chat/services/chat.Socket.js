import { io } from "socket.io-client";

let socket;

export const initializeSocketConnection = () => {
    if (!socket) {
        socket = io("https://perplexity-4d0u.onrender.com/", {
            withCredentials: true,
            transports: ["websocket", "polling"],
            reconnection: true,
        });
    }

    socket.on("connect", () => {
        console.log("connected to Socket.IO server", socket.id);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket.IO connection failed:", error.message);
    });

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const disconnectSocketConnection = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
