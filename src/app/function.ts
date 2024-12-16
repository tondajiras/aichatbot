import { Message } from "./types";
import * as dotenv from "dotenv";

dotenv.config();

const API_URL = "https://api.x.ai/v1/chat/completions";
const API_KEY = process.env.NEXT_PUBLIC_APIKEY;

export default async function callGrokAPI(
  messages: Message[],
  inputMessage: string
) {
  if (!API_KEY) {
    console.error("API URL or API Key is missing");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.text,
          })),
          { role: "user", content: inputMessage },
        ],
        model: "grok-beta",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const NewMessage: Message = {
      text: data.choices[0].message.content,
      role: "system",
    };
    return NewMessage as Message;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
