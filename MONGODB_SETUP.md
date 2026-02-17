# MongoDB Atlas Setup Guide

## Step 1: Create a Project
1. Login to [MongoDB Atlas](https://account.mongodb.com/account/login)
2. Click "Create new project" (green button)
3. Enter project name: `realtime-poll`
4. Click "Next"
5. Skip adding members (can do later)
6. Click "Create Project"

## Step 2: Build a Database
1. From project dashboard, click "Build a Database"
2. Select "M0 Sandbox" (Free Tier) → "Create"
3. Choose configuration:
   - Provider: AWS
   - Region: Mumbai (ap-south-1)
4. Click "Create Cluster"

## Step 3: Database User & IP Whitelist
1. In setup wizard, create database user:
   - Username: polladmin
   - Password: Click "Auto Generate" and save
2. Click "Create Database User"
3. Add IP address: Click "Add My Current IP Address"
4. For testing, add `0.0.0.0/0` (insecure for production)
5. Click "Add IP Address"

## Step 4: Connect to Cluster
1. Wait for cluster to deploy (2-3 minutes)
2. Click "Connect" → "Connect your application"
3. Select Node.js driver (version 4.0+)
4. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your generated password
6. Add database name:
   ```
   mongodb+srv://polladmin:yourpassword@cluster0.mongodb.net/realtime-poll?retryWrites=true&w=majority
   ```

## Step 5: Configure Application
1. Update `server/.env` with your connection string
2. In Render, update MONGO_URI environment variable
3. Restart your backend service

## Step 6: Test Connection
Create a simple test file `test-connection.js`:
```javascript
const mongoose = require('mongoose');
const MONGO_URI = 'your-connection-string';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connection successful!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
```
Run: `node test-connection.js`

## Step 7: Production Best Practices
- Use specific IP whitelist instead of 0.0.0.0/0
- Enable IP whitelist automation
- Monitor connection activity in Atlas dashboard
- Set up alerts for critical events
