import React, { useState, useRef, useEffect } from 'react';
import '../styles/dashboard.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [gptAdvice, setGptAdvice] = useState('');
  const adviceRef = useRef(null); // 💬 Ref to the advice div

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpense = {
      date: e.target.date.value,
      type: e.target.type.value,
      description: e.target.description.value,
      amount: parseFloat(e.target.amount.value),
      category: e.target.category.value,
      status: e.target.status.value,
    };

    setExpenses([...expenses, newExpense]);
    e.target.reset();
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleGetAdvice = async () => {
    if (expenses.length === 0) {
      alert("Add some expenses first.");
      return;
    }

    try {
      setLoadingAdvice(true);

      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses }),
      });

      const data = await response.json();
      setGptAdvice(data.message);
    } catch (error) {
      console.error(error);
      setGptAdvice('⚠️ Failed to get advice from ChatGPT.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  // 💬 Scroll to advice automatically
  useEffect(() => {
    if (gptAdvice && adviceRef.current) {
      adviceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gptAdvice]);

  return (
    <div className="dashboard-content">
      <h1>Welcome to SmartSplit Dashboard</h1>

      {/* Cards Section */}
      <div className="card--container">
        <h3 className="main--title">Today's Data</h3>
        <div className="card--wrapper">
          <div className="payment--card light--red">
            <div className="card--header">
              <div className="amount">
                <span className="title">Total Expenses</span>
                <span className="amount--value">£{totalAmount.toFixed(2)}</span>
              </div>
              <i className="fas fa-pound-sign icon"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Input Form */}
      <form className="finance--form" onSubmit={handleSubmit}>
        <input type="date" id="date" name="date" required />
        <input type="text" id="type" name="type" placeholder="Transaction Type" required />
        <input type="text" id="description" name="description" placeholder="Description" required />
        <input type="number" id="amount" name="amount" placeholder="Amount" required />
        <input type="text" id="category" name="category" placeholder="Category" required />
        <select id="status" name="status" required>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Expense</button>
        <button type="button" onClick={handleGetAdvice} disabled={loadingAdvice}>
          {loadingAdvice ? 'Thinking...' : 'Get Spending Advice 💬'}
        </button>
      </form>

      {/* Finance Table */}
      <div className="tabular--wrapper">
        <h3 className="main--title">Finance Data</h3>
        <div className="table--container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction Type</th>
                <th>Description</th>
                <th>Amount (£)</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.date}</td>
                  <td>{expense.type}</td>
                  <td>{expense.description}</td>
                  <td>£{expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6">Total: £{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 💬 Display GPT Advice */}
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
    </div>
  );
}

export default Dashboard;
