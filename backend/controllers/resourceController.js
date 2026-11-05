import axios from "axios";

export const generateResources = async (req, res) => {
  try {
    const { skill } = req.body;

    const prompt = `
Generate study resources for the skill: ${skill}

Return ONLY JSON.
No explanation.
No extra text.

Format:
{
  "english": {
    "youtube": [
      {"title":"", "url":""}
    ],
    "documentation": [
      {"title":"", "url":""}
    ],
    "practice": [
      {"title":"", "url":""}
    ]
  },
  "hindi": {
    "youtube": [
      {"title":"", "url":""}
    ],
    "documentation": [
      {"title":"", "url":""}
    ],
    "practice": [
      {"title":"", "url":""}
    ]
  }
}

Important:
Provide REAL and valid YouTube links.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 1200,
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

    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ message: "Invalid AI format" });
    }

    const json = JSON.parse(match[0]);

    res.json(json);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "AI resource generation failed" });
  }
};
