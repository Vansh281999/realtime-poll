# MongoDB Atlas: Quick Setup (Step-by-Step)

## Step 3: Database User & IP Whitelist (Simplified)

### Part 3.1: Create Database User
1. After creating your cluster, you'll see the "Security Quickstart" wizard
2. In "Add a database user" section:
   - **Username**: Type `polladmin`
   - **Password**: Click "Auto Generate Secure Password" → **SAVE THIS!**
3. Click "Create Database User" (green button)

### Part 3.2: Configure IP Whitelist
1. In "Where would you like to connect from?" section:
   - Click "Add My Current IP Address" (auto-detects your IP)
2. To allow testing from anywhere temporarily:
   - Click "Add IP Address"
   - Enter `0.0.0.0/0` as IP Address
   - Description: "All IPs for testing"
   - Click "Confirm"
3. Click "Finish and Close"

### If You Missed the Wizard:
1. Go to Cluster Dashboard → "Security"
2. **Database Access**: Manage users
3. **Network Access**: Manage IP whitelist

## Test Connection (10-Second Test)

1. Create `quick-test.js` in `server/`:
```javascript
const mongoose = require('mongoose');
const MONGO_URI = 'YOUR_CONNECTION_STRING';

async function test() {
  try {
    console.log('🔍 Connecting...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connection successful!');
    
    const Poll = mongoose.model('Poll', new mongoose.Schema({
      _id: String, question: String, options: Array, voters: Array
    }));
    
    await new Poll({
      _id: 'test-poll',
      question: 'Test Question?',
      options: ['Option 1', 'Option 2'],
      voters: []
    }).save();
    
    console.log('✅ Test poll created');
    await Poll.deleteOne({ _id: 'test-poll' });
    await mongoose.connection.close();
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

2. Run from server directory:
```bash
npm install mongoose
node quick-test.js
```

## Connection String Format
Your string should look like:
```
mongodb+srv://polladmin:YOUR_PASSWORD@cluster0.mongodb.net/realtime-poll?retryWrites=true&w=majority
```

## Common Fixes:
- **Timeout**: Check internet and cluster status
- **Auth error**: Verify password
- **Authz error**: Check IP whitelist
- **DNS error**: Check string format
