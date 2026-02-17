const mongoose = require('mongoose');

// Use direct connection string format (without SRV)
// Replace with your actual cluster information
const MONGO_URI = 'mongodb://polladmin:yourpassword@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/realtime-poll?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔍 Attempting direct connection to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connection successful!');
    
    console.log('📊 Database Name:', mongoose.connection.db.databaseName);
    
    const PollSchema = new mongoose.Schema({
      _id: String,
      question: String,
      options: [{ text: String, votes: Number }],
      voters: [String],
      createdAt: Date,
      updatedAt: Date
    });
    
    const Poll = mongoose.model('Poll', PollSchema);
    
    const testPoll = new Poll({
      _id: 'quick-test-poll2',
      question: 'Direct Connection Test?',
      options: [
        { text: 'Option 1', votes: 0 },
        { text: 'Option 2', votes: 0 }
      ],
      voters: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await testPoll.save();
    console.log('✅ Test poll created successfully');
    
    const foundPoll = await Poll.findById('quick-test-poll2');
    if (foundPoll) {
      console.log('🔍 Found poll:');
      console.log('  Question:', foundPoll.question);
      console.log('  Options:', foundPoll.options);
    }
    
    await Poll.deleteOne({ _id: 'quick-test-poll2' });
    console.log('🧹 Test poll deleted');
    
    await mongoose.connection.close();
    console.log('🎉 Connection test passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('💡 DNS resolution failed - check internet or cluster name');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused - cluster may be provisioning');
    } else if (error.code === 8000) {
      console.error('💡 Authentication failed - check password');
    } else if (error.code === 13) {
      console.error('💡 Authorization failed - check IP whitelist');
    }
  }
}

testConnection();
