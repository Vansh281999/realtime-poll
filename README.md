# Real-Time Poll Rooms

A full-stack real-time poll application with shareable links, real-time result updates, and anti-abuse mechanisms.

## Features

- **Poll Creation**: Create polls with custom questions and multiple options
- **Shareable Links**: Generate unique shareable links for each poll
- **Real-Time Results**: Live updates of poll results using Socket.io
- **Fairness/Anti-Abuse Mechanisms**: IP-based voter tracking and localStorage for duplicate prevention
- **Persistent Storage**: MongoDB for storing polls and votes
- **Responsive UI**: Modern, mobile-friendly interface

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for routing
- Axios for HTTP requests
- Socket.io-client for real-time communication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- CORS for cross-origin requests

## Fairness/Anti-Abuse Mechanisms

### 1. IP-Based Voter Tracking
Each poll stores the IP addresses of voters in the `voters` array. When a user attempts to vote, their IP address is checked against this list. If they've already voted, the request is rejected.

```javascript
// In server/index.js
const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
if (poll.voters.includes(ip)) {
  return res.status(400).json({ error: "You have already voted" });
}
```

### 2. LocalStorage for Duplicate Prevention
On the client-side, after a user votes, a flag is stored in localStorage using the poll ID. This prevents accidental duplicate votes from the same browser.

```javascript
// In client/src/PollRoom.jsx
localStorage.setItem(`voted_${id}`, true);
```

## Edge Cases Handled

1. **Invalid Poll Data**: Rejects polls with empty questions or less than 2 valid options
2. **Duplicate Votes**: Prevents users from voting multiple times (IP + localStorage)
3. **Invalid Vote Requests**: Handles cases with invalid option indexes or missing parameters
4. **Poll Not Found**: Gracefully handles requests for non-existent polls
5. **Empty Options**: Filters out empty options when creating polls
6. **Duplicate Options**: Ensures all poll options are unique
7. **Too Many Options**: Limits polls to maximum 10 options
8. **Network Errors**: Handles API errors with user-friendly messages

## Known Limitations

1. **IP Spoofing**: IP-based tracking can be bypassed using VPNs or proxies
2. **Browser Clearing**: LocalStorage can be cleared, allowing duplicate votes from the same device
3. **Single Device Multiple Voters**: A single IP address could represent multiple voters behind a NAT
4. **No Authentication**: Anyone with the poll link can vote (this is intentional for simplicity)
5. **Poll Expiration**: Polls currently don't expire
6. **Analytics**: No detailed analytics or vote history
7. **Anonymous Voting**: No option to track individual voters

## Installation

### Prerequisites
- Node.js
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
1. Navigate to the `server` directory
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB connection string
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to the `client` directory
2. Install dependencies: `npm install`
3. Create a `.env` file with `VITE_API_URL=http://localhost:5000`
4. Start the development server: `npm run dev`

## API Endpoints

### Poll Management
- `POST /api/polls`: Create a new poll
- `GET /api/polls/:id`: Get poll details
- `GET /api/polls`: Get all polls (limited to 100)
- `DELETE /api/polls/:id`: Delete a poll

### Voting
- `POST /api/polls/:id/vote`: Vote on a poll

## Usage

1. Open the application and create a new poll
2. Enter a question and at least 2 options
3. Click "Create Poll" to generate a shareable link
4. Share the link with voters
5. View real-time results as voters submit their votes

## Deployment

The application can be deployed to various platforms:

### Frontend
- Vercel
- Netlify
- GitHub Pages

### Backend
- Heroku
- Render
- DigitalOcean

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
