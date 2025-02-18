import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatWithAI(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful tattoo expert assistant. Provide concise, accurate information about tattoos, aftercare, and the tattooing process. Keep responses friendly but professional."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, I'm having trouble processing your request right now.";
  }
}
