# MongoDB Atlas Setup Guide

A detailed step-by-step guide to setting up a free MongoDB Atlas cluster for your Real-Time Poll Rooms application.

## 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up using your email, Google, GitHub, or Facebook account
4. Complete the registration process by providing your details

## 2. Create a Free Cluster

1. After logging in, you'll be taken to the Atlas Dashboard
2. Click "Build a Database" or "Create" in the "Clusters" section
3. Select the **M0 Sandbox** (Free Tier) option - it's free forever
4. Choose your preferred cloud provider and region:
   - **Provider**: AWS (recommended for compatibility with Render)
   - **Region**: Select a region close to your users (e.g., Mumbai (ap-south-1) for India)
5. Click "Create Cluster"

## 3. Set Up Database User

1. While your cluster is being created, you'll see a setup wizard
2. Under "Create a Database User", set:
   - **Username**: Choose a username (e.g., `polladmin`)
   - **Password**: Create a strong password (or click "Auto Generate" for a secure password)
   - **Authentication Method**: Select "Password"
3. Click "Create Database User"

## 4. Configure IP Whitelist

1. Next, under "Add IP Address", configure which IP addresses can connect:
   - **Option 1**: Click "Add My Current IP Address" to allow your local machine
   - **Option 2**: For production, click "Add IP Address" and enter your specific IP range
   - **Option 3**: For testing, you can temporarily allow all IP addresses by entering `0.0.0.0/0`
     - **Warning**: This is insecure for production, but convenient for testing
2. Click "Add IP Address"

## 5. Connect to Your Cluster

1. Once your cluster is created (this takes a few minutes), click "Connect"
2. Choose "Connect your application" as the connection method
3. Select "Node.js" as the driver
4. Select the latest version (or version 4.0 or later)
5. Copy the connection string - it will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

## 6. Modify Connection String

1. Replace `<username>` with the database user you created
2. Replace `<password>` with your database user's password
3. Add your database name at the end of the connection string. For this app, use `realtime-poll`:
   ```
   mongodb+srv://polladmin:yourpassword@cluster0.mongodb.net/realtime-poll?retryWrites=true&w=majority
   ```

## 7. Test the Connection

### Using Node.js
1. Create a simple test file `test-mongo.js` in your project:
   ```javascript
   const mongoose = require('mongoose');
   
   const MONGO_URI = 'your-connection-string-here';
   
   async function testConnection() {
     try {
       await mongoose.connect(MONGO_URI);
       console.log('✅ Successfully connected to MongoDB Atlas');
       
       // Test creating a simple document
       const testSchema = new mongoose.Schema({
         name: String,
         timestamp: Date
       });
       
       const TestModel = mongoose.model('Test', testSchema);
       
       const testDoc = new TestModel({
         name: 'Test Connection',
         timestamp: new Date()
       });
       
       await testDoc.save();
       console.log('✅ Successfully created and saved a test document');
       
       // Verify the document exists
       const foundDoc = await TestModel.findOne({ name: 'Test Connection' });
       if (foundDoc) {
         console.log('✅ Test document found in database');
         console.log('  - ID:', foundDoc._id);
         console.log('  - Name:', foundDoc.name);
         console.log('  - Timestamp:', foundDoc.timestamp);
       }
       
       // Clean up
       await TestModel.deleteOne({ _id: foundDoc._id });
       console.log('✅ Cleaned up test document');
       
       // Disconnect
       await mongoose.connection.close();
       console.log('✅ Connection closed');
       
     } catch (error) {
       console.error('❌ Error connecting to MongoDB:', error);
       if (error.code === 'ERR_INVALID_URL') {
         console.error('  - Check your connection string format');
       } else if (error.code === 'ENOTFOUND') {
         console.error('  - Cannot resolve MongoDB host');
       } else if (error.code === 8000) {
         console.error('  - Authentication failed (username/password issue)');
       } else if (error.code === 13) {
         console.error('  - Authorization failed (IP whitelist issue)');
       }
     }
   }
   
   testConnection();
   ```

2. Run the test:
   ```bash
   cd c:/Users/vansh/Downloads/realtime-poll/server
   npm install mongoose
   node test-mongo.js
   ```

### Using the Atlas Console

1. In the Atlas Dashboard, go to your cluster
2. Click "Collections"
3. You should see your database `realtime-poll` listed
4. You can create collections and documents directly from the console

## 8. Production Best Practices

### Security

1. **Don't use 0.0.0.0/0 in production**: Only allow specific IP addresses
2. **Use strong passwords**: Avoid simple passwords
3. **Enable two-factor authentication**: For your Atlas account
4. **Use environment variables**: Never hardcode connection strings
5. **Regularly rotate passwords**: Change database user passwords periodically

### Performance

1. **Use appropriate instance sizes**: Upgrade from M0 if you need more resources
2. **Indexing**: Add indexes to fields you query frequently
3. **Connection pooling**: Use connection strings with appropriate pool sizes
4. **Sharding**: For very large datasets, consider sharding

### Monitoring

1. **Enable Atlas Alerts**: Set up alerts for critical events
2. **Review Performance Metrics**: Use the Atlas Performance Advisor
3. **Logs**: Enable and monitor database logs
4. **Real-time Performance Panel**: Use the RTPP to identify slow queries

## 9. Common Issues & Solutions

### Connection Failures

1. **IP Whitelist Issue**:
   - Solution: Check your IP whitelist settings in Atlas
   - Try adding `0.0.0.0/0` temporarily for testing

2. **Authentication Failure**:
   - Solution: Verify your username and password are correct
   - Check that your database user has the correct permissions

3. **DNS Resolution Failure**:
   - Solution: Try using the direct connection string instead of SRV
   - Check your internet connection

### Performance Issues

1. **Slow Queries**:
   - Solution: Use the Performance Advisor to find and fix slow queries
   - Add indexes to frequently queried fields

2. **High CPU Usage**:
   - Solution: Check for inefficient queries or large operations
   - Consider upgrading your cluster size

## 10. Backing Up Your Data

1. **Atlas Snapshots**: Free clusters include daily automatic backups
2. **Manual Snapshots**: For paid clusters, you can create manual snapshots
3. **Export Data**: Use `mongodump` or the Atlas Data Export tool

## 11. Troubleshooting Tools

1. **MongoDB Compass**: Desktop GUI for database management
2. **mongo Shell**: Command-line interface
3. **Atlas Diagnostic Tools**: Built-in performance monitoring
4. **Network Test**: Use `telnet` or `nc` to test connectivity

## 12. Resources

- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
- [MongoDB University](https://university.mongodb.com/)

By following this guide, you'll have a fully functional MongoDB Atlas database ready to use with your Real-Time Poll Rooms application.
