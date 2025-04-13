// src/features/GoalTracking/GoalProgress.jsx

import React, { useEffect, useState } from 'react';
import GoalPieChart from '../components/GoalPieChart';
import { db } from '../firebaseConfig';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import '../styles/GoalTracking.css';

const GoalProgress = ({ goals, onUpdateSaved }) => {
  const [localGoals, setLocalGoals] = useState(goals);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  useEffect(() => {
    const fetchAndApplyIncome = async () => {
      const expensesSnapshot = await getDocs(collection(db, 'expenses'));
      const incomeEntries = expensesSnapshot.docs
        .map((doc) => doc.data())
        .filter((e) => e.amount > 0);

      const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amount, 0);

      if (totalIncome > 0) {
        const updatedGoals = [...localGoals];
        const incomePerGoal = totalIncome / updatedGoals.length;

        for (let i = 0; i < updatedGoals.length; i++) {
          updatedGoals[i].saved = (updatedGoals[i].saved || 0) + incomePerGoal;

          // Update Firestore
          if (updatedGoals[i].id) {
            const goalRef = doc(db, 'goals', updatedGoals[i].id);
            await updateDoc(goalRef, { saved: updatedGoals[i].saved });
          }
        }

        setLocalGoals([...updatedGoals]);
      }
    };

    fetchAndApplyIncome();
  }, []);

  return (
    <div className="goal-progress-grid">
      {localGoals.map((goal, index) => (
        <div key={goal.id} className="goal-progress-item">
          <strong>Goal {index + 1}:</strong> ${goal.saved.toFixed(2)} of ${goal.amount} saved
          <GoalPieChart saved={goal.saved} amount={goal.amount} />
        </div>
      ))}
    </div>
  );
};

export default GoalProgress;
