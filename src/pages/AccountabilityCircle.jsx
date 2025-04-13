// src/features/GoalTracking/GoalTrackerHP.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from 'firebase/firestore';

import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';
import GoalProgress from '../components/GoalProgress';
import Suggestions from '../components/Suggestions';
import '../styles/GoalTracking.css';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsCollection = collection(db, 'goals');
      const data = await getDocs(goalsCollection);
      const loadedGoals = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setGoals(loadedGoals);
    };

    fetchGoals();
  }, []);

  const handleAddGoal = async (goal) => {
    const goalsCollection = collection(db, 'goals');
    const docRef = await addDoc(goalsCollection, goal);
    setGoals((prev) => [...prev, { ...goal, id: docRef.id }]);
  };

  const handleUpdateSaved = async (index, newSaved) => {
    const updatedGoals = [...goals];
    const goal = updatedGoals[index];
    goal.saved = parseFloat(newSaved) || 0;

    setGoals(updatedGoals);

    if (goal.id) {
      const goalRef = doc(db, 'goals', goal.id);
      await updateDoc(goalRef, { saved: goal.saved });
    }
  };

  return (
    <div className="accountability-container">
      <h1 className="accountability-title">🎯 Goal Tracker</h1>

      <div className="goal-grid">
        <section className="card--container">
          <h2 className="main--title">Add New Goal</h2>
          <GoalForm onAddGoal={handleAddGoal} />
        </section>

        <section className="card--container">
          <h2 className="main--title">Goal Progress</h2>
          <GoalProgress goals={goals} onUpdateSaved={handleUpdateSaved} />
        </section>

        <section className="card--container">
          <h2 className="main--title">Current Goals</h2>
          <GoalList goals={goals} />
        </section>

        <section className="card--container">
          <h2 className="main--title">💡 Suggestions</h2>
          <Suggestions goals={goals} />
        </section>
      </div>
    </div>
  );
};

export default GoalTracker;
