import mongoose from "mongoose";

const chatScheema = new mongoose.Schema({
     user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            default: 'New Chat',
            trim: true,
        },
},{timestamps:true})


const chatModel = mongoose.model("Chat",chatScheema)

export default chatModel;