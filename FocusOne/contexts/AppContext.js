<<<<<<< HEAD
import React, { createContext, useState } from "react";
=======
import React, { createContext, useState } from 'react';
>>>>>>> 41040d06f3b848fac142751ac6689d9627a1df08

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
<<<<<<< HEAD
  const [goals, setGoals] = useState([]);

  const addGoal = (goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  return (
    <AppContext.Provider value={{ goals, addGoal }}>
=======
  // إدارة البيانات (Global State)
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Graduation Project',
      progress: 85,
      tasks: [
        { id: '1', title: 'UI Design', duration: 30, completed: true },
        { id: '2', title: 'Backend Integration', duration: 45, completed: false },
      ],
    },
    {
      id: '2',
      title: 'Fitness Journey',
      progress: 40,
      tasks: [{ id: '3', title: 'Morning Run', duration: 20, completed: false }],
    }
  ]);

  const [selectedGoalId, setSelectedGoalId] = useState(null);

  // وظيفة تحديث حالة المهمة (State Management)
  const toggleTask = (goalId, taskId) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...goal, tasks: updatedTasks };
      }
      return goal;
    }));
  };

  return (
    <AppContext.Provider value={{ goals, setGoals, selectedGoalId, setSelectedGoalId, toggleTask }}>
>>>>>>> 41040d06f3b848fac142751ac6689d9627a1df08
      {children}
    </AppContext.Provider>
  );
};
