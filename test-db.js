const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://usalone370122:alone2004@server.fpv41av.mongodb.net/foodshare?retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('🗄️ Database name:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection state:', mongoose.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('📝 Error message:', error.message);
    console.error('🔢 Error code:', error.code);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 This might be a DNS resolution issue. Check your internet connection.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 This might be a firewall or network issue.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Check your username and password in the connection string.');
    } else if (error.message.includes('Server selection timeout')) {
      console.error('💡 This might be a network timeout. Check your internet connection.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔒 Connection closed.');
  }
}

testConnection(); 