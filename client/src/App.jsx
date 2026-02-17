import { Routes, Route } from "react-router-dom";
import CreatePoll from "./CreatePoll";
import PollRoom from "./PollRoom";
import Header from "./Header";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <Header />
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollRoom />} />
      </Routes>
    </div>
  );
}