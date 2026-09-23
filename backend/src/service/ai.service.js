import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "langchain";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

const mistralModal = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not configured");
  }

  const history = messages
    .filter((msg) => msg && typeof msg.content === "string")
    .map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }

      if (msg.role === "ai") {
        return new HumanMessage(msg.content);
      }

      return null;
    })
    .filter(Boolean);

  const response = await model.invoke([
    new SystemMessage(`You are a helpful, clear, and concise assistant. Answer the user's latest message based on the prior chat context. If you are unsure, say so honestly.`),
    ...history,
  ]);

  return typeof response?.text === "string" ? response.text : String(response?.content || "");
}

export async function generateChatTitle(message) {
  const response = await mistralModal.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.`),
    new HumanMessage(`Generate a title for a chat conversation based on the following first message:
            "${message}"`),
  ]);

  return response.text
}