import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' in request body" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ works with all OpenAI accounts
      messages: [
        { role: "system", content: "You are a helpful assistant for analyzing experimental data." },
        { role: "user", content: query },
      ],
    });
    

    const message = response.choices[0].message.content || "";

    res.status(200).json({
      answer: message,
      insights: extractBullets(message, "Insights"),
      suggestions: extractBullets(message, "Suggestions"),
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to analyze data" });
  }
}

// Optional helper: split the response into sections
function extractBullets(text, sectionTitle) {
  const regex = new RegExp(`${sectionTitle}:\\s*\\n([\\s\\S]*?)(\\n\\n|$)`, "i");
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1]
      .split("\n")
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}
