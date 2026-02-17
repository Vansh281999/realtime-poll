import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL;
const socket = io(API);

export default function PollRoom() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    axios.get(`${API}/api/polls/${id}`).then(res => {
      setPoll(res.data);
      const votes = res.data.options.reduce((sum, opt) => sum + opt.votes, 0);
      setTotalVotes(votes);
    }).catch(error => {
      console.error("Error fetching poll:", error);
    });

    socket.emit("joinPoll", id);
    socket.on("update", options => {
      setPoll(p => ({ ...p, options }));
      const votes = options.reduce((sum, opt) => sum + opt.votes, 0);
      setTotalVotes(votes);
    });

    const alreadyVoted = localStorage.getItem(`voted_${id}`);
    setHasVoted(!!alreadyVoted);
  }, []);

  const vote = async index => {
    if (hasVoted) return;
    setIsVoting(true);

    try {
      await axios.post(`${API}/api/polls/${id}/vote`, {
        optionIndex: index
      });

      localStorage.setItem(`voted_${id}`, true);
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
      if (error.response?.status === 400) {
        alert("You have already voted");
        localStorage.setItem(`voted_${id}`, true);
        setHasVoted(true);
      } else {
        alert("Failed to vote");
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (!poll) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px" }}>
        {poll.question}
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <span style={{
          backgroundColor: "#f8f9fa",
          padding: "10px 20px",
          borderRadius: "25px",
          fontSize: "14px",
          color: "#6c757d"
        }}>
          Total Votes: {totalVotes}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {poll.options.map((o, i) => {
          const percentage = totalVotes > 0 
            ? Math.round((o.votes / totalVotes) * 100) 
            : 0;

          return (
            <div
              key={i}
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                overflow: "hidden"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px"
              }}>
                <span style={{ fontSize: "16px", fontWeight: "500" }}>{o.text}</span>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "5px 12px",
                    borderRadius: "15px",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    {percentage}%
                  </span>
                  <span style={{ fontSize: "14px", color: "#6c757d" }}>
                    {o.votes} votes
                  </span>
                </div>
              </div>
              
              <div style={{
                height: "8px",
                backgroundColor: "#e0e0e0"
              }}>
                <div
                  style={{
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: "#2196f3",
                    transition: "width 0.3s ease-in-out"
                  }}
                />
              </div>

              {!hasVoted && (
                <div style={{ padding: "10px 20px" }}>
                  <button
                    style={{
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                    onClick={() => vote(i)}
                    disabled={isVoting}
                  >
                    {isVoting ? "Voting..." : "Vote"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div style={{
          textAlign: "center",
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#e8f5e9",
          borderRadius: "12px",
          color: "#2e7d32"
        }}>
          <p style={{ margin: 0 }}>Thank you for voting! Your vote has been counted.</p>
        </div>
      )}

      <div style={{
        textAlign: "center",
        marginTop: "40px",
        padding: "20px",
        backgroundColor: "#f3e5f5",
        borderRadius: "12px"
      }}>
        <h4 style={{ marginBottom: "10px", color: "#4a148c" }}>Share this poll:</h4>
        <p style={{ margin: 0, color: "#6a1b9a" }}>
          {window.location.origin}/poll/{id}
        </p>
      </div>
    </div>
  );
}