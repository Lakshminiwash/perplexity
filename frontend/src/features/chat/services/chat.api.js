import axios from "axios"

const api = axios.create({
    baseURL:"/",
    withCredentials:true
})

export async function sendMessage({message,chatId}) {
    const response = await api.post("/api/chat/message",{message,chat:chatId})
    return response.data
}

export async function getChats() {
    const response = await api.get("/api/chat")
    return response.data
}

export async function getMessages({chatId}) {
    const response = await api.get(`/api/chat/${chatId}/messages`)
    return response.data
}

export async function deleteChat({chatId}) {
    const response = await api.delete(`/api/chat/delete/${chatId}`)
    return response.data
}