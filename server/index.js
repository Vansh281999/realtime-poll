import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempting to connect to MongoDB (${attempt}/${maxRetries})...`);
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ Connected to MongoDB');
            return; // Connection successful
        } catch (err) {
            console.error(`❌ MongoDB connection error (attempt ${attempt}):`, err.message);
            
            if (attempt === maxRetries) {
                console.error('❌ Max retries reached. Exiting...');
                process.exit(1);
            }
            
            console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

connectDB();

const PollSchema = new mongoose.Schema({
  _id: String,
  question: String,
  options: [{ text: String, votes: { type: Number, default: 0 } }],
  voters: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model("Poll", PollSchema);

app.post("/api/polls", async (req, res) => {
  try {
    const { question, options } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }
    
    const validOptions = (options || []).filter(opt => opt && opt.trim());
    if (validOptions.length < 2) {
      return res.status(400).json({ error: "At least 2 valid options are required" });
    }
    
    if (validOptions.length > 10) {
      return res.status(400).json({ error: "Maximum 10 options allowed" });
    }
    
    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size < validOptions.length) {
      return res.status(400).json({ error: "Options must be unique" });
    }

    const pollId = uuidv4();
    const poll = new Poll({
      _id: pollId,
      question: question.trim(),
      options: validOptions.map(o => ({ text: o.trim(), votes: 0 })),
      voters: []
    });

    await poll.save();
    res.status(201).json({ pollId });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
});

app.get("/api/polls/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    
    res.json(poll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ error: "Failed to fetch poll" });
  }
});

app.post("/api/polls/:id/vote", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (poll.voters.includes(ip)) {
      return res.status(400).json({ error: "You have already voted" });
    }

    if (typeof optionIndex !== "number" || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: "Invalid option" });
    }

    poll.options[optionIndex].votes++;
    poll.voters.push(ip);
    poll.updatedAt = Date.now();

    await poll.save();
    io.to(poll._id).emit("update", poll.options);

    res.json({ success: true });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ error: "Failed to vote" });
  }
});

app.delete("/api/polls/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    await Poll.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ error: "Failed to delete poll" });
  }
});

app.get("/api/polls", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 }).limit(100);
    res.json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});

io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  socket.on("joinPoll", pollId => {
    socket.join(pollId);
    console.log("Client joined poll:", pollId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));