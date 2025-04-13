// src/features/GoalTracking/GoalPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00C49F', '#ff4d4d']; // green for progress, orange for remaining

const GoalPieChart = ({ saved, amount }) => {
  const progress = Math.min(saved, amount);
  const remaining = Math.max(amount - saved, 0);

  const data = [
    { name: 'Saved', value: progress },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <div style={{ width: 150, height: 150 }}>
      <PieChart width={150} height={150}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default GoalPieChart;