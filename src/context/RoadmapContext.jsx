import { createContext, useState, useEffect } from "react";

export const RoadmapContext = createContext();

export const RoadmapProvider = ({ children }) => {
  const [completedMonths, setCompletedMonths] = useState(() => {
    const saved = localStorage.getItem("completedMonths");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("completedMonths", JSON.stringify(completedMonths));
  }, [completedMonths]);

  const toggleMonth = (index) => {
    setCompletedMonths((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = Object.values(completedMonths).filter(Boolean).length;

  return (
    <RoadmapContext.Provider
      value={{
        completedMonths,
        toggleMonth,
        completedCount,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};
