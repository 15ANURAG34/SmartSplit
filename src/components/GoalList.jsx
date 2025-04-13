import React from 'react';

const GoalList = ({ goals }) => {
  if (goals.length === 0) return <p>No goals added yet.</p>;

  return (
    <ul>
      {goals.map((goal, index) => (
        <li key={index}>
          <strong>Amount:</strong> ${goal.amount} | <strong>Deadline:</strong> {goal.deadline}
        </li>
      ))}
    </ul>
  );
};

export default GoalList;
