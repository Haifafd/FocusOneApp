import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);

  const addGoal = (goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  return (
    <AppContext.Provider value={{ goals, addGoal }}>
      {children}
    </AppContext.Provider>
  );
};
