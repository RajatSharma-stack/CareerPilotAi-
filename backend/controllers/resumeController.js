import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import careerSkills from "../data/careerSkills.js";

const findMissingSkills = (resumeText, requiredSkills) => {
  const present = requiredSkills.filter((skill) => {
    const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, "i");
    return regex.test(resumeText);
  });

  const missing = requiredSkills.filter((skill) => {
    const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, "i");
    return !regex.test(resumeText);
  });

  return { present, missing };
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ================= READ PDF =================
    const uint8Array = new Uint8Array(req.file.buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let resumeText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      resumeText += pageText + " ";
    }

    resumeText = resumeText.slice(0, 3000).toLowerCase();

    // ================= CAREER GOAL =================
    let goal = req.body.goal;

    if (!goal) {
      return res.status(400).json({ message: "Career goal not provided" });
    }

    goal = goal.toLowerCase().trim();

    let requiredSkills = careerSkills[goal];
    let result = null;
    let localScore = 0;

    if (requiredSkills) {
      result = findMissingSkills(resumeText, requiredSkills);

      // ✅ SCORE OUT OF 100
      localScore = Math.round(
        (result.present.length / requiredSkills.length) * 100,
      );
    }

    // ================= AI ANALYSIS =================
    let aiResult = null;

    try {
      if (process.env.GROQ_API_KEY) {
        const aiPrompt = `
You are an ATS resume analyzer.

Evaluate this resume for the role: ${goal}

Return STRICT JSON:

{
  "score": number,
  "strengths": [],
  "missingSkills": [],
  "suggestions": []
}

Resume Text:
${resumeText}
`;

        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 0.3,
            max_tokens: 800,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const rawContent = response.data.choices[0].message.content;
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (err) {
      console.log("AI failed, using fallback matcher");
    }

    // ================= FINAL SCORE =================
    let finalScore = localScore;

    if (aiResult?.score) {
      const normalizedAIScore =
        aiResult.score <= 1
          ? Math.round(aiResult.score * 100)
          : Math.round(aiResult.score);

      finalScore = Math.round((normalizedAIScore + localScore) / 2);
    }

    // ================= FINAL RESPONSE =================
    res.json({
      score: finalScore,
      strengths: aiResult?.strengths ?? result?.present ?? [],
      missingSkills: aiResult?.missingSkills ?? result?.missing ?? [],
      suggestions: aiResult?.suggestions ?? [
        "Build practical projects",
        "Improve technical depth",
        "Add measurable achievements",
        "Learn industry tools",
      ],
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ message: "Resume analysis failed" });
  }
};
