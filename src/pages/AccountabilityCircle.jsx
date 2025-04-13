import React, { useState } from "react";

export default function AccountabilityCircle() {
  const [nameInput, setNameInput] = useState("");
  const [circleData, setCircleData] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const addFriend = () => {
    const name = nameInput.trim();
    if (!name) return alert("Enter your friend's name.");
    if (circleData.length >= 3) return alert("Only 3 friends allowed.");
    if (circleData.find((f) => f.name.toLowerCase() === name.toLowerCase()))
      return alert("This friend is already added.");

    const budget = Math.floor(Math.random() * 150) + 50;
    const spending = Math.floor(Math.random() * budget * 1.3);
    const progress = Math.min(Math.round((spending / budget) * 100), 130);

    setCircleData([...circleData, { name, weeklyBudget: budget, weeklySpending: spending, progress }]);
    setNameInput("");
  };

  const deleteFriend = (i) => {
    setCircleData(circleData.filter((_, idx) => idx !== i));
  };

  // ✨ Updated generateSummary with correct POST body and loading spinner
  const generateSummary = async () => {
    setLoading(true);

    const stats = circleData
      .map(
        (member) =>
          `- ${member.name}: spent $${member.weeklySpending} of $${member.weeklyBudget} (${member.progress}%)`
      )
      .join("\n");

    try {
      const response = await fetch("http://localhost:3001/accountability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendStats: stats }), // ✅ Correct JSON
      });

      const data = await response.json();
      setSummary(data.message.trim());
    } catch (error) {
      console.error("Backend error:", error);
      setSummary("⚠️ Error generating summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "#e5e5e5",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "rgba(113, 99, 186, 1)",
        }}
      >
        Accountability Circle
      </h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Friend's name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          onClick={addFriend}
          style={{
            background: "rgba(113, 99, 186, 1)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Add Friend
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {circleData.map((member, idx) => {
          const { name, weeklySpending, weeklyBudget, progress } = member;
          const color =
            progress <= 60 ? "#10b981" :
            progress <= 90 ? "#f59e0b" : "#ef4444";

          return (
            <div key={idx} style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem"
              }}>
                <div style={{ fontWeight: "600", color: "#333" }}>{name}</div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span>{progress}% used</span>
                  <button
                    onClick={() => deleteFriend(idx)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{
                height: "8px",
                backgroundColor: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "0.5rem"
              }}>
                <div
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: "100%",
                    backgroundColor: color,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <div style={{
                fontSize: "0.9rem",
                color: "#374151",
                textAlign: "right",
                fontWeight: "500",
              }}>
                Spent ${weeklySpending} of ${weeklyBudget} budget ({progress}%)
              </div>
            </div>
          );
        })}
      </div>

      {/* ✨ Button + Loading Spinner */}
      <button
        onClick={generateSummary}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: loading ? "#b0a7f7" : "rgba(113, 99, 186, 1)",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "6px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating Summary..." : "Get Weekly Summary"}
      </button>

      {/* ✨ Loading Spinner or Summary Display */}
      {loading && (
        <div style={{
          marginTop: "1rem",
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#715FDB",
        }}>
          ⏳ Generating advice...
        </div>
      )}

      {summary && !loading && (
        <div style={{
          marginTop: "1.5rem",
          background: "#fff8dc",
          padding: "1rem",
          borderRadius: "10px",
          border: "1px solid #facc15",
          fontSize: "0.95rem",
          whiteSpace: "pre-wrap",
          marginBottom: "2rem"
        }}>
          {summary}
        </div>
      )}
    </div>
  );
}
