import { createContext, useState, useEffect } from "react";

export const CareerContext = createContext();

export const CareerProvider = ({ children }) => {
  const [careerData, setCareerData] = useState(() => {
    const saved = localStorage.getItem("careerData");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (careerData) {
      localStorage.setItem("careerData", JSON.stringify(careerData));
    }
  }, [careerData]);

  const isOnboarded = !!careerData;

  return (
    <CareerContext.Provider value={{ careerData, setCareerData, isOnboarded }}>
      {children}
    </CareerContext.Provider>
  );
};
