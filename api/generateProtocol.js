// api/generateProtocol.js
import OpenAI from "openai";

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { experimentTitle, goal, methods, analysisTypes } = req.body;

  if (!experimentTitle || !goal || !methods) {
    return res
      .status(400)
      .json({ error: "Missing required fields: experimentTitle, goal, or methods" });
  }

  // —— 从这里开始 —— 构造更详细的 system+user prompt
  const systemPrompt = `
You are a world-class laboratory protocol writer.
Your task is to produce an extremely detailed, step-by-step experimental protocol.
Include for each section:
- Exact quantities (with units) for every reagent/material.
- Precise timings, temperatures, concentrations.
- Safety precautions and critical tips.
- Use these headings with emojis, in this order:
  1. 🔬 What you'll need
  2. 📋 Step-by-Step Procedure
  3. 🧪 Data Analysis
  4. ⚠️ Important Tips & Safety
Always number your steps, and use bullet points where appropriate.
`.trim();

  const userPrompt = `
Title: ${experimentTitle}
Goal: ${goal}
Design Rationale: ${methods}
Analysis Types: ${
    Array.isArray(analysisTypes) ? analysisTypes.join(", ") : analysisTypes || "Not specified"
  }

Generate the protocol following the system instructions above.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const protocolText = completion.choices[0].message.content;
    return res.status(200).json({ protocol: protocolText });
  } catch (error) {
    console.error("OpenAI API error in /api/generateProtocol:", error);
    return res.status(500).json({ error: "Failed to generate protocol" });
  }
  // —— 到这里结束 —— 
}
