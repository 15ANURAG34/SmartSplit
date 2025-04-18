import React, { useState, useRef, useEffect } from 'react';
import '../styles/dashboard.css';

const TOGETHER_API_KEY = process.env.REACT_APP_TOGETHER_API_KEY;

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [initialBudgetInput, setInitialBudgetInput] = useState('');
  const [showBudgetPopup, setShowBudgetPopup] = useState(true);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [gptAdvice, setGptAdvice] = useState('');
  const adviceRef = useRef(null);

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
    setExpenses((prev) => [...prev, newEntry]);
    form.reset();
  };

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (e.type.toLowerCase() === 'expenses' ? e.amount : 0), 0
  );
  const totalIncome = expenses.reduce(
    (sum, e) => sum + (e.type.toLowerCase() === 'income' ? e.amount : 0), 0
  );
  const budgetLeft = totalBudget + totalIncome - totalExpenses;

  const avgExpense = expenses.filter(e => e.type.toLowerCase() === 'expenses').length > 0
    ? (totalExpenses / expenses.filter(e => e.type.toLowerCase() === 'expenses').length).toFixed(2)
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
    try {
      setLoadingAdvice(true);
      const expenseList = expenses.map((e) =>
        `- ${e.date}: ${e.description} (${e.type}) - $${e.amount}`
      ).join("\n");

      const prompt = `
You are a helpful financial coach. Here's a list of my recent expenses:

${expenseList}

Give me 2-3 personalized tips on budgeting, saving, or avoiding overspending based on this data. Make them encouraging Do not include any emojis at all.
`;

      const res = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [
            { role: "system", content: "You are a helpful personal finance advisor for college students." },
            { role: "user", content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "⚠️ No advice received.";
      setGptAdvice(reply.trim());
    } catch (error) {
      console.error("Advice fetch error:", error);
      setGptAdvice("⚠️ Failed to get advice from Together.ai.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  useEffect(() => {
    if (gptAdvice && adviceRef.current) {
      adviceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gptAdvice]);

  return (
    <div className="main--content">
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

      <div className="header--wrapper">
        <div className="header--title">
          <h2>SmartSplit</h2>
          <span>Dashboard</span>
        </div>
      </div>

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
                <span className="amount--value">{expenses.length}</span>
              </div>
              <i className="fas fa-list icon dark--purple"></i>
            </div>
          </div>

          <div className="payment--card light--green">
            <div className="card--header">
              <div className="amount">
                <span className="title">Average Expense Per Entry</span>
                <span className="amount--value">
                  {expenses.length > 0 ? `$${avgExpense}` : 'N/A'}
                </span>
              </div>
              <i className="fa-solid fa-face-surprise icon dark--green icon--large"></i>
            </div>
          </div>
        </div>
      </div>

      <form className="finance--form" onSubmit={handleFormSubmit}>
        <input type="date" name="date" required />
        <select name="type" required>
          <option value="expenses">Expenses</option>
          <option value="income">Income</option>
        </select>
        <input type="text" name="description" placeholder="Description" required />
        <input type="number" name="amount" placeholder="Amount" required />
        <select name="status" required>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Entry</button>
      </form>

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
          disabled={loadingAdvice}
        >
          {loadingAdvice ? 'Loading Advice...' : 'Get Spending Advice'}
        </button>
      </div>

      {gptAdvice && (
        <div
          ref={adviceRef}
          style={{
            backgroundColor: '#f1f4ff',
            marginTop: '2rem',
            padding: '2rem',
            borderRadius: '15px',
            border: '2px solid #b5c9ff',
            boxShadow: '0 0 15px rgba(113, 99, 186, 0.4)',
            fontSize: '1.2rem',
            color: '#333',
            animation: 'fadeIn 0.8s ease-in-out',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <h2 style={{ marginBottom: '10px', color: '#715FDB' }}>💬 SmartSplit AI Advice</h2>
          <p>{gptAdvice}</p>
        </div>
      )}

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
              {expenses.map((entry, index) => (
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
