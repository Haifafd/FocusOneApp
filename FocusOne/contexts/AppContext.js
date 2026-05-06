import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
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
      tasks: [
        { id: '3', title: 'Morning Run', duration: 20, completed: false }
      ],
    }
  ]);

  const [selectedGoalId, setSelectedGoalId] = useState(null);

  // وظيفة تحديث حالة المهمة
  const toggleTask = (goalId, taskId) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedTasks = goal.tasks.map(task =>
            task.id === taskId
              ? { ...task, completed: !task.completed }
              : task
          );
          return { ...goal, tasks: updatedTasks };
        }
        return goal;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        goals,
        setGoals,
        selectedGoalId,
        setSelectedGoalId,
        toggleTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
