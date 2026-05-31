import { addMessages, addNewMessage, createNewChat, setChats, setCurrentChatId, setLoading, } from "../chat.slice";
import { getChats, getMessages, sendMessage } from "../services/chat.api";
import { initializeSocketConnection } from "../services/chat.Socket";
import { useDispatch } from "react-redux"

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data

        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user"
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
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
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenchat(chatId) {
        const data = await getMessages(chatId)
        const { messages } = data

        const formatedMessages = messages.map(msg => ({
            content: msg.content,
            role: msg.role
        }));
        dispatch(addMessages({
            chatId,
            messages: formatedMessages
        }))
        dispatch(setCurrentChatId(chatId))
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenchat

    }
}