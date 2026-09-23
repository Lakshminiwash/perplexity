import chatModel from "../modals/chat.modal.js";
import messageModal from "../modals/message.modal.js";
import userModal from "../modals/user.modal.js";
import { generateChatTitle, generateResponse } from "../service/ai.service.js";

export async function sendMessage(req, res) {
    const { message, chat: chatId } = req.body

    let chat = null
    let title = "New chat"

    if (!chatId) {
        try {
            title = await generateChatTitle(message)
        } catch (error) {
            console.error("Chat title generation failed:", error)
            title = "New chat"
        }

        try {
            chat = await chatModel.create({
                user: req.user.id,
                title
            })
        } catch (error) {
            console.error("Chat creation failed:", error)
            return res.status(500).json({
                success: false,
                message: "Failed to create chat"
            })
        }
    }

    const chatRefId = chatId || chat._id

    const userMessage = await messageModal.create({
        chat: chatRefId,
        content: message,
        role: "user",
    })

    const messages = await messageModal.find({ chat: chatRefId })

    let result = "I couldn't generate a response right now. Please try again in a moment."

    try {
        result = await generateResponse(messages)
    } catch (error) {
        console.error("AI response generation failed:", error)
    }

    const aiMessage = await messageModal.create({
        chat: chatRefId,
        content: result,
        role: "ai",
    })

    res.status(201).json({
        title,
        chat,
        aiMessage
    })
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })
    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "chat not found"
        })
    }

    const messages = await messageModal.find({
        chat: chatId
    })

    res.status(200).json({
        message: "messages received successfully",
        messages
    })
}

export async function deleteChat(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModal.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}