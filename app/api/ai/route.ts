import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await groq.chat.completions.create({
  model: "openai/gpt-oss-120b",
  messages: [
    {
      role: "system",
      content:
        "You are an expert AI tutor. Generate educational content that can vary across multiple valid interpretations while remaining academically correct. Do not repeat previous phrasing.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.9,
  top_p: 0.95,
  max_completion_tokens: 1024,
});

    return NextResponse.json({
      text: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: "AI service error" },
      { status: 500 }
    );
  }
}
