import React, { useState, useRef, useEffect } from 'react';
import '../styles/dashboard.css';

const TOGETHER_API_KEY = process.env.REACT_APP_TOGETHER_API_KEY;

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [gptAdvice, setGptAdvice] = useState('');
  const adviceRef = useRef(null);

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

    setExpenses((prev) => [...prev, newExpense]);
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

      const expenseList = expenses.map((e) =>
        `- ${e.date}: ${e.description} (${e.category}) - £${e.amount}`
      ).join("\n");

      const prompt = `
You are a helpful financial coach. Here's a list of my recent expenses:

${expenseList}

Give me 2-3 personalized tips on budgeting, saving, or avoiding overspending based on this data. Make it casual and encouraging. Include one emoji.
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
    <div className="dashboard-content">
      <h1>Welcome to SmartSplit Dashboard</h1>

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
        <input type="date" name="date" required />
        <input type="text" name="type" placeholder="Transaction Type" required />
        <input type="text" name="description" placeholder="Description" required />
        <input type="number" name="amount" placeholder="Amount" required />
        <input type="text" name="category" placeholder="Category" required />
        <select name="status" required>
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

      {/* GPT Advice */}
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
