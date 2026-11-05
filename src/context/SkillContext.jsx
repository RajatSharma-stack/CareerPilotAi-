import { createContext, useState, useEffect, useContext } from "react";
import { CareerContext } from "./CareerContext";

export const SkillContext = createContext();

export const SkillProvider = ({ children }) => {
  const { careerData } = useContext(CareerContext);

  const getSkillsByCareer = (career) => {
    switch (career) {
      case "Frontend Developer":
        return [
          { id: 1, name: "HTML", completed: false },
          { id: 2, name: "CSS", completed: false },
          { id: 3, name: "JavaScript", completed: false },
          { id: 4, name: "React", completed: false },
        ];

      case "Backend Developer":
        return [
          { id: 1, name: "Node.js", completed: false },
          { id: 2, name: "Express", completed: false },
          { id: 3, name: "Database", completed: false },
          { id: 4, name: "Authentication", completed: false },
        ];

      case "Data Analyst":
        return [
          { id: 1, name: "Excel", completed: false },
          { id: 2, name: "SQL", completed: false },
          { id: 3, name: "Python", completed: false },
          { id: 4, name: "Power BI", completed: false },
        ];

      case "Government Job":
        return [
          { id: 1, name: "Quantitative Aptitude", completed: false },
          { id: 2, name: "Reasoning", completed: false },
          { id: 3, name: "English", completed: false },
          { id: 4, name: "Current Affairs", completed: false },
        ];

      default:
        return [];
    }
  };

  const [skills, setSkills] = useState([]);

  // Update skills when career changes
  useEffect(() => {
    if (careerData?.career) {
      const newSkills = getSkillsByCareer(careerData.career);
      setSkills(newSkills);
      localStorage.setItem("skills", JSON.stringify(newSkills));
    }
  }, [careerData]);

  const toggleSkill = (id) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, completed: !skill.completed } : skill,
      ),
    );
  };

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const completedCount = skills.filter((s) => s.completed).length;
  const progress = skills.length
    ? Math.round((completedCount / skills.length) * 100)
    : 0;

  return (
    <SkillContext.Provider value={{ skills, toggleSkill, progress }}>
      {children}
    </SkillContext.Provider>
  );
};
