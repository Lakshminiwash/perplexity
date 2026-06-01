import { addMessages, addNewMessage, createNewChat, removeChat, setChats, setCurrentChatId, setLoading, } from "../chat.slice";
import { deleteChat, getChats, getMessages, sendMessage } from "../services/chat.api";
import { initializeSocketConnection } from "../services/chat.Socket";
import { useDispatch } from "react-redux"

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data

        if (!chatId) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
        }
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user"
        }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
        } finally{
            dispatch(setLoading(false))
        }
        
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true))
            const data = await getChats()
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt
                }
                return acc
            }, {})))

            // Most recent chat auto-open — pehli chat hi latest hoti hai
            if (chats.length > 0) {
                const recentChatId = [...chats].reverse()[0]._id
                dispatch(setCurrentChatId(recentChatId))
            }
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleOpenchat(chatId, chats) {
        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages({ chatId })
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat({chatId})
            dispatch(removeChat(chatId))
        } catch (error) {
            console.log(error)
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenchat,
        handleDeleteChat

    }
}