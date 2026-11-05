import { useEffect, useState } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    const storedData = JSON.parse(localStorage.getItem("aiRoadmap")) || {};

    const roadmapArray = Array.isArray(storedData)
      ? storedData
      : storedData.roadmap || [];

    const completedMonths = roadmapArray.filter((m) => m.completed === true);

    if (completedMonths.length === 0) {
      alert("Complete at least one month first.");
      setLoading(false);
      return;
    }

    const skills = completedMonths.flatMap((m) => m.skills || []);

    try {
      const response = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      alert("Quiz generation failed");
    }

    setLoading(false);
  };

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    let total = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctIndex) {
        total++;
      }
    });

    setScore(total);
  };

  if (loading) {
    return <div className="p-10 text-white">Generating AI Quiz...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">AI Skill Assessment Quiz</h1>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-gray-800 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold">{q.question}</h2>

          {q.options.map((option, oIndex) => {
            const isSelected = answers[qIndex] === oIndex;
            const isCorrect = q.correctIndex === oIndex;

            let style =
              "block w-full text-left p-3 mb-3 rounded-lg transition ";

            if (score !== null) {
              if (isCorrect) style += "bg-green-600";
              else if (isSelected) style += "bg-red-600";
              else style += "bg-gray-700";
            } else {
              style += isSelected
                ? "bg-purple-600"
                : "bg-gray-700 hover:bg-gray-600";
            }

            return (
              <button
                key={oIndex}
                onClick={() => handleSelect(qIndex, oIndex)}
                className={style}
              >
                {option}
              </button>
            );
          })}
        </div>
      ))}

      {score === null && questions.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-3 rounded-lg font-semibold"
        >
          Submit Quiz
        </button>
      )}

      {score !== null && (
        <div className="mt-8 bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold">
            Your Score: {score} / {questions.length}
          </h2>
        </div>
      )}
    </div>
  );
};

export default Quiz;
