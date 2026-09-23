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

function buildLocalTitle(message) {
  const clean = String(message || "").trim();
  if (!clean) return "New chat";

  const words = clean.split(/\s+/).filter(Boolean);
  const titleWords = words.slice(0, 4);
  const title = titleWords.join(" ").slice(0, 40);

  return title || "New chat";
}

export async function generateResponse(messages) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not configured");
  }

  try {
    const history = (messages || [])
      .filter((msg) => msg && typeof msg.content === "string")
      .slice(-10)
      .map((msg) => {
        if (msg.role === "user" || msg.role === "ai") {
          return new HumanMessage(msg.content);
        }
        return null;
      })
      .filter(Boolean);

    const response = await model.invoke([
      new SystemMessage(`You are a helpful, clear, and concise assistant. Answer the user's latest message based on the prior chat context. If you are unsure, say so honestly.`),
      ...history,
    ]);

    return typeof response?.text === "string"
      ? response.text
      : String(response?.content || "");
  } catch (error) {
    const message = (error?.message || "").toLowerCase();

    if (message.includes("429") || message.includes("rate limit") || message.includes("too many requests")) {
      return "The AI service is currently rate-limited. Please try again in a moment.";
    }

    throw error;
  }
}

export async function generateChatTitle(message) {
  try {
    if (!process.env.MISTRAL_API_KEY) {
      return buildLocalTitle(message);
    }

    const response = await mistralModal.invoke([
      new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.`),
      new HumanMessage(`Generate a title for a chat conversation based on the following first message: "${message}"`),
    ]);

    return response.text || buildLocalTitle(message);
  } catch (error) {
    return buildLocalTitle(message);
  }
}