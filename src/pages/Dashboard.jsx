import React, { useState } from 'react';
import '../styles/dashboard.css';

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [showBudgetPopup, setShowBudgetPopup] = useState(true);
  const [initialBudgetInput, setInitialBudgetInput] = useState('');
  const [advice, setAdvice] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newEntry = {
      date: form.date.value,
      type: form.type.value,
      description: form.description.value,
      amount: parseFloat(form.amount.value),
      status: form.status.value,
    };

    setEntries([...entries, newEntry]);
    form.reset();
  };

  const totalExpenses = entries.reduce((sum, entry) => sum + (entry.type.toLowerCase() === 'expenses' ? entry.amount : 0), 0);
  const budgetLeft = totalBudget - totalExpenses;
  const avgExpense = entries.length > 0
    ? (totalExpenses / entries.length).toFixed(2)
    : 0;

  const updateBudget = () => {
    const newBudget = prompt('Enter your new budget:');
    const parsed = parseFloat(newBudget);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalBudget(parsed);
    } else {
      alert('Invalid budget amount.');
    }
  };

  const handleStartTracking = () => {
    const parsed = parseFloat(initialBudgetInput);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalBudget(parsed);
      setShowBudgetPopup(false);
    } else {
      alert('Please enter a valid budget amount.');
    }
  };

  const getSpendingAdvice = async () => {
    const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const prompt = `I spent $${totalSpent} this week. Can you give me 3 fun, easy tips to save money next week?`;

    try {
      const response = await fetch('http://localhost:5000/spending-advice', { // your server API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setAdvice(data.advice);
    } catch (err) {
      console.error('Error fetching advice:', err);
      setAdvice('Error getting advice. Please try again.');
    }
  };

  return (
    <div className="main--content">
      {/* Budget Popup */}
      {showBudgetPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Set Your Budget</h2>
            <input
              type="number"
              value={initialBudgetInput}
              onChange={(e) => setInitialBudgetInput(e.target.value)}
              placeholder="Enter total budget"
            />
            <button className="start-tracking-btn" onClick={handleStartTracking}>
              Start Tracking
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header--wrapper">
        <div className="header--title">
          <span>SmartSplit</span>
          <h2>Dashboard</h2>
        </div>
      </div>

      {/* Cards */}
      <div className="card--container">
        <div className="title--row">
          <h3 className="main--title">Today's data</h3>
          <button className="update-budget-btn" onClick={updateBudget}>
            Change Budget
          </button>
        </div>

        <div className="card--wrapper">
          <div className="payment--card light--red">
            <div className="card--header">
              <div className="amount">
                <span className="title">Budget Left Over</span>
                <span className="amount--value">${budgetLeft.toFixed(2)}</span>
              </div>
              <i className="fa-solid fa-dollar-sign icon dark--red"></i>
            </div>
          </div>

          <div className="payment--card light--purple">
            <div className="card--header">
              <div className="amount">
                <span className="title">Number Of Entries</span>
                <span className="amount--value">{entries.length}</span>
              </div>
              <i className="fas fa-list icon dark--purple"></i>
            </div>
          </div>

          <div className="payment--card light--green">
            <div className="card--header">
              <div className="amount">
                <span className="title">Average Expense Per Entry</span>
                <span className="amount--value">
                  {entries.length > 0 ? `$${avgExpense}` : 'N/A'}
                </span>
              </div>
              <i className="fa-solid fa-face-surprise icon dark--green icon--large"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Form */}
      <form id="finance-form" className="finance--form" onSubmit={handleFormSubmit}>
        <input type="date" name="date" required />
        <select name="type" required>
          <option value="expenses">Expenses</option>
        </select>
        <input type="text" name="description" placeholder="Description" required />
        <input type="number" name="amount" placeholder="Amount" required />
        <select name="status" required>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Entry</button>
      </form>

      {/* Get Spending Advice Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          style={{
            backgroundColor: 'rgba(113, 99, 186, 1)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none'
          }}
          onClick={getSpendingAdvice}
        >
          Get Spending Advice
        </button>
      </div>

      {/* Advice Display */}
      {advice && (
        <div style={{
          background: '#f9f9f9',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          {advice}
        </div>
      )}

      {/* Table */}
      <div className="tabular--wrapper">
        <h3 className="main--title">Finance data</h3>
        <div className="table--container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.type}</td>
                  <td>{entry.description}</td>
                  <td>${entry.amount.toFixed(2)}</td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
