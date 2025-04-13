import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios'; // <-- Make sure axios is installed

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 💬 ChatGPT/Together.ai Advice for Personal Expenses (Dashboard)
app.post('/chat', async (req, res) => {
  const { expenses } = req.body;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: "meta-llama/Llama-3-70b-chat-hf", // Together.ai model
        messages: [
          {
            role: "system",
            content: "You are a personal finance advisor helping students spend better."
          },
          {
            role: "user",
            content: `Here are my latest expenses: ${JSON.stringify(expenses)}. Give me 2 suggestions to save money.`
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gptMessage = response.data.choices[0].message.content;
    res.json({ message: gptMessage });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error communicating with Together.ai');
  }
});

// 🧑‍🤝‍🧑 ChatGPT/Together.ai Accountability Circle Summary
app.post('/accountability', async (req, res) => {
  const { friendStats } = req.body;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Different model for summaries
        messages: [
          {
            role: "system",
            content: "Using my budget and list of recent expenses Give me 2-3 personalized tips on budgeting, saving, or avoiding overspending based on this data. Make it casual and encouraging. Include one emoji."
          },
          {
            role: "user",
            content: `
You are a helpful financial assistant. Below is a list of friends and their weekly budget usage:

${friendStats}

Write a short, friendly summary for them, using a light tone and at least one emoji.`,
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "No summary available.";
    res.json({ message: reply.trim() });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error communicating with Together.ai');
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
