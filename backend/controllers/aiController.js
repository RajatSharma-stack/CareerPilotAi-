import axios from "axios";

export const generateRoadmap = async (req, res) => {
  try {
    const { goal, level, duration } = req.body;

    const prompt = `
Create a structured learning roadmap.

Return ONLY JSON.
No explanation.
No text before or after JSON.

Format:
{
  "roadmap":[
    {
      "month":"Month 1",
      "title":"Topic name",
      "skills":["skill1","skill2"],
      "projects":["project1"]
    }
  ],
  "skills":[{"name":"skill"}]
}

Goal: ${goal}
Level: ${level}
Duration: ${duration}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: "You are a strict JSON generator API.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    let content = response.data.choices[0].message.content;

    console.log("RAW AI:", content);

    // -------- SAFE JSON EXTRACTION --------
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      return res.status(500).json({ message: "AI returned invalid format" });
    }

    const json = JSON.parse(match[0]);

    res.json(json);
  } catch (err) {
    console.error("AI FULL ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "AI generation failed" });
  }
};
