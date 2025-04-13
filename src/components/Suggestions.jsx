// src/features/GoalTracking/Suggestions.jsx

import React from 'react';

const Suggestions = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return <p>No suggestions yet. Add a goal to get started!</p>;
  }

  // Basic logic: Show a tip if any goal is below 50% saved
  const tips = goals.map((goal, index) => {
    const percent = ((goal.saved || 0) / goal.amount) * 100;

    if (percent < 50) {
      return (
        <li key={goal.id || index}>
          For Goal {index + 1}, try saving a little more each week to stay on track!
        </li>
      );
    }

    return (
      <li key={goal.id || index}>
        Great job on Goal {index + 1}! You're more than halfway there.
      </li>
    );
  });

  return (
    <ul>
      {tips}
    </ul>
  );
};

export default Suggestions;