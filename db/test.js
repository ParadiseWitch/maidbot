const { MongoClient } = require('mongodb');
const connectionString = "mongodb://admin:123456@localhost:27017/mx-space"
const client = new MongoClient(connectionString);

// Database Name
const dbName = 'mx-space';
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName); 
  const collection = db.collection('options');
  const ret = await collection.find({}).toArray();
  console.log(ret);
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
