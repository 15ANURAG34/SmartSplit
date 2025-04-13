import React, { useState } from 'react';

// ✅ Access your Together.ai API key from environment variables
const TOGETHER_API_KEY = process.env.REACT_APP_TOGETHER_API_KEY;

function GoalForm({ onAddGoal }) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    try {
      const today = new Date();
      const formattedToday = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replaceAll('/', '-');

      console.log("🔑 TOGETHER_API_KEY:", TOGETHER_API_KEY);
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_API_KEY}`, // 🔥 Use dynamic key
        },
        body: JSON.stringify({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [
            {
              role: 'user',
              content: `Given the input: "${input}", extract the amount and deadline.

              Respond ONLY with a valid JSON object like:
              { "amount": 500, "deadline": "MM-DD-YYYY" }

              IMPORTANT:
              - Do NOT include any explanation.
              - deadline must be a valid MM-DD-YYYY string.
              - If no year is mentioned, assume current year.
              - Always interpret "by ___ weeks" or "in ___ weeks" or "___ weeks from now" as (7 * number) days from today's date.
              - Treat all verbs like "save", "gather", "collect", "get", etc., the same when identifying the goal amount.
              - Assume today's date is ${formattedToday}.`
            }
          ],
          temperature: 0,
          max_tokens: 100
        })
      });

      const data = await response.json();
      console.log("🔍 FULL Together.ai API response:", data);

      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid API response: No choices received');
      }

      const content = data.choices[0].message.content;
      const cleaned = content.replace(/```json|```/g, '').trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error("No valid JSON block found");

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);

        // Handle cases where deadline is missing a year (e.g., "June 1")
        if (/^[A-Za-z]+\s\d{1,2}$/.test(parsed.deadline)) {
          const currentYear = new Date().getFullYear();
          parsed.deadline = `${parsed.deadline} ${currentYear}`;

          const date = new Date(parsed.deadline);
          parsed.deadline = date.toISOString().split('T')[0];
        }
      } catch (err) {
        console.error("❌ Failed to parse cleaned content:", cleaned);
        throw err;
      }

      // ✅ Actually add the goal here
      if (parsed.amount && parsed.deadline) {
        onAddGoal({
          amount: parsed.amount,
          deadline: parsed.deadline,
          saved: 0,
        });
      } else {
        throw new Error("Missing amount or deadline in parsed goal");
      }

    } catch (err) {
      console.error('🔥 NLP parsing failed:', err);
      alert('Sorry! Could not parse your goal.');
    }

    setInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="goal-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Save $300 by June 1"
      />
    </form>
  );
}

export default GoalForm;
