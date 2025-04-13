// src/features/GoalTracking/GoalProgress.jsx
import React from 'react';
import GoalPieChart from '../components/GoalPieChart';

const GoalProgress = ({ goals, onUpdateSaved }) => {
  return (
    <div>
      {goals.map((goal, index) => (
        <div key={goal.id} style={{ marginBottom: '2rem' }}>
          <strong>Goal {index + 1}:</strong> ${goal.saved || 0} of ${goal.amount} saved
          <GoalPieChart saved={goal.saved} amount={goal.amount} />
        </div>
      ))}
    </div>
  );
};

export default GoalProgress;
