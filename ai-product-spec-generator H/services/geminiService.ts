import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageAuthor } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const chatSystemInstruction = `You are an expert product manager AI. Your goal is to help users flesh out their product ideas into a detailed product specification. 
Start by asking clarifying questions about the user's initial idea. 
Ask one or two questions at a time to not overwhelm the user. 
Analyze the user's responses and continue asking targeted questions to gather all necessary details.
Cover aspects like target audience, key features, user pain points, and potential monetization.
When you are confident you have enough information to write a comprehensive spec, end your message with the special token [GENERATE_SPEC]. 
Do not include this token until you have gathered sufficient detail.`;

// FIX: Updated prompt to request HTML for direct rendering.
const specGenerationSystemInstruction = `You are an expert technical writer AI. Based on the provided conversation between a user and a product manager AI, generate a comprehensive product specification document.
The document must be in HTML format.
It should be well-structured, clear, and detailed.
Use appropriate HTML tags for structure (e.g., <h1> for the main title, <h2> for sections, <ul>, <li>, <p>, <strong>).
The document should include the following sections:
- "Introduction & Vision": A brief overview of the product and its purpose.
- "Target Audience": A detailed description of the ideal users.
- "Key Features": A prioritized list of features with detailed descriptions for each.
- "User Stories": Write several user stories in the format: "As a [type of user], I want [an action] so that [a benefit]."
- "Non-Functional Requirements": Address aspects like performance, security, and scalability.
- "Success Metrics": Define key performance indicators (KPIs) to measure the product's success.`;


// FIX: Refactored to use the public `history` parameter on `create` instead of assigning to an internal property.
export const continueChat = async (history: Message[]): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const geminiHistory = history
      .filter(msg => msg.author !== MessageAuthor.SYSTEM)
      .map(msg => ({
          role: msg.author === MessageAuthor.USER ? 'user' : 'model',
          parts: [{ text: msg.content }],
      }));

  // The last message is the new user prompt, which we'll send.
  const lastMessage = geminiHistory.pop();
  if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error("Invalid chat history. Last message must be from user.");
  }

  const chat = ai.chats.create({
      model: model,
      history: geminiHistory,
      config: {
          systemInstruction: chatSystemInstruction,
      },
  });

  const response: GenerateContentResponse = await chat.sendMessage({ message: lastMessage.parts[0].text });
  return response.text;
};

export const generateSpecFromChat = async (history: Message[]): Promise<string> => {
    const model = 'gemini-2.5-pro'; // Use a more powerful model for document generation

    const conversationText = history
        .filter(msg => msg.author !== MessageAuthor.SYSTEM)
        .map(msg => `${msg.author === MessageAuthor.USER ? 'User' : 'Product Manager'}: ${msg.content}`)
        .join('\n\n');

    const prompt = `Here is the conversation history:\n\n---\n\n${conversationText}\n\n---\n\nPlease generate the product specification document based on this conversation.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: specGenerationSystemInstruction,
        }
    });

    return response.text;
}