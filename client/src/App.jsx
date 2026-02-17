import { Routes, Route } from "react-router-dom";
import CreatePoll from "./CreatePoll";
import PollRoom from "./PollRoom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePoll />} />
      <Route path="/poll/:id" element={<PollRoom />} />
    </Routes>
  );
}