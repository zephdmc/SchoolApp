const { MongoClient } = require('mongodb');

async function testDB() {
  const client = new MongoClient('your_mongodb_connection_string');

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  } finally {
    await client.close();
  }
}

testDB();