import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [link, setLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createPoll = async () => {
    if (!question.trim()) return alert("Please enter a question");
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) return alert("Please enter at least 2 valid options");

    setIsCreating(true);
    try {
      const res = await axios.post(`${API}/api/polls`, {
        question,
        options: validOptions
      });
      setLink(`${window.location.origin}/poll/${res.data.pollId}`);
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll");
    } finally {
      setIsCreating(false);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return alert("Poll must have at least 2 options");
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Create New Poll</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "20px"
          }}
          placeholder="Enter your question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
            />
            {options.length > 2 && (
              <button
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "0 15px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onClick={() => removeOption(i)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        
        <button
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
          onClick={addOption}
        >
          + Add Option
        </button>
      </div>

      <button
        style={{
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          padding: "12px 30px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          width: "100%"
        }}
        onClick={createPoll}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Poll"}
      </button>

      {link && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h3 style={{ color: "#2c3e50" }}>Poll Created Successfully!</h3>
          <p style={{ marginBottom: "10px" }}>Share this link with voters:</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <input
              style={{
                flex: 1,
                maxWidth: "400px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}
              value={link}
              readOnly
            />
            <button
              style={{
                backgroundColor: "#f39c12",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => {
                navigator.clipboard.writeText(link);
                alert("Link copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}