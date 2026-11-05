import axios from "axios";

export const generateQuiz = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || skills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    const prompt = `
Generate 5 multiple choice questions based on these skills:

${skills.join(", ")}

Return strictly in this JSON format:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctIndex": 0
  }
]
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a quiz generator." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiText = response.data.choices[0].message.content;

    const quiz = JSON.parse(aiText);

    res.json(quiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};
