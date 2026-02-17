const mongoose = require('mongoose');

// Your actual MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://polladmin:571CDWKTSa08rIDT@cluster0.mongodb.net/realtime-poll?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔍 Attempting to connect to MongoDB Atlas...');
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
      _id: 'quick-test-poll',
      question: 'Quick Test Question?',
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
    
    const foundPoll = await Poll.findById('quick-test-poll');
    if (foundPoll) {
      console.log('🔍 Found poll:');
      console.log('  Question:', foundPoll.question);
      console.log('  Options:', foundPoll.options);
    }
    
    await Poll.deleteOne({ _id: 'quick-test-poll' });
    console.log('🧹 Test poll deleted');
    
    await mongoose.connection.close();
    console.log('🎉 Connection test passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('💡 DNS resolution failed - cluster may still be provisioning');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused - cluster not ready');
    } else if (error.code === 8000) {
      console.error('💡 Authentication failed - check credentials');
    } else if (error.code === 13) {
      console.error('💡 Authorization failed - check IP whitelist');
    }
  }
}

testConnection();
