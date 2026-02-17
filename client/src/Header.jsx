import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "15px 20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link to="/" style={{
          fontSize: "20px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "white"
        }}>
          Real-Time Polls
        </Link>
        
        <nav>
          <Link to="/" style={{
            color: "white",
            textDecoration: "none",
            marginLeft: "20px",
            padding: "8px 15px",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
            Create Poll
          </Link>
        </nav>
      </div>
    </header>
  );
}
