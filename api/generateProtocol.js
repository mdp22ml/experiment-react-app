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

  const { experimentTitle, goal, methods, analysisTypes, fileContent } = req.body;

  if (!experimentTitle || !goal || !methods) {
    return res
      .status(400)
      .json({ error: "Missing required fields: experimentTitle, goal, or methods" });
  }

  // 构造系统提示
  const systemPrompt = `
You are a laboratory protocol generator.
Your task is to generate ONLY two sections:
1. Materials and Reagents
2. Step-by-Step Protocol

Requirements:
- Materials section: List ALL reagents, consumables, and equipment with specific details (brand, catalog number, concentration, volumes, etc.)
- Protocol section: Numbered steps with exact amounts, temperatures, times, and methods
- Output must be plain text format
- NO discussion, analysis, results, summary, or explanations
- NO extra sections beyond Materials and Protocol
- Be extremely specific with quantities, timings, and conditions

Format exactly as:
Materials and Reagents:
- [Item 1 with full specifications]
- [Item 2 with full specifications]
...

Step-by-Step Protocol:
1. [Specific step with exact parameters]
2. [Specific step with exact parameters]
...
`.trim();

  // 构造用户提示
  let userPrompt;
  
  if (fileContent) {
    // 如果有文件内容，优先使用文件内容
    userPrompt = `
Based on the uploaded protocol document, generate a detailed materials list and step-by-step protocol.
Follow the original document's formatting, step order, and all specified parameters (volumes, temperatures, timing).

Document content:
${fileContent}

Title: ${experimentTitle}
Goal: ${goal}
Methods: ${methods}

Generate only Materials and Step-by-Step Protocol sections in plain text.
`.trim();
  } else {
    // 如果没有文件内容，基于用户输入生成
    userPrompt = `
Generate a detailed laboratory protocol for:

Title: ${experimentTitle}
Goal: ${goal}
Methods: ${methods}
Analysis Types: ${Array.isArray(analysisTypes) ? analysisTypes.join(", ") : analysisTypes || "Not specified"}

Generate only Materials and Step-by-Step Protocol sections in plain text.
Include specific brands, catalog numbers, concentrations, and volumes where possible.
`.trim();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3, // 降低温度以获得更一致的输出
      max_tokens: 2500, // 增加token数以容纳更详细的协议
    });

    const protocolText = completion.choices[0].message.content;
    return res.status(200).json({ protocol: protocolText });
  } catch (error) {
    console.error("OpenAI API error in /api/generateProtocol:", error);
    return res.status(500).json({ error: "Failed to generate protocol" });
  }
}
