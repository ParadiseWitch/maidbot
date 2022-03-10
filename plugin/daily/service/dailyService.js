const { MongoClient } = require('mongodb');
const CONFIG = require('../../../config');
const {getChinaTime} = require('../../../utils/DateUtil');

const DB_NAME = 'todo';
const COLLECTION_NAME = 'daily';

const getDbConfig = async () => {
  const client = new MongoClient(CONFIG.db.mongo.url)
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);
  return { client, db, collection };
}

const getAllDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  const ret = await collection.find({}).toArray();
  await client.close();
  return ret;
}

const getLastDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  const ret = await collection.find({}).sort({ $natural: -1 }).limit(1).toArray();
  await client.close();
  return ret;
}

const addDaily = async (money = 10, date = getChinaTime()) => {
  const { client, db, collection } = await getDbConfig();

  const ret = await collection.insertOne({
    date: date,
    money: money,
    user: 'xj',
    sum: '10',
    name: 'daily'
  });
  await client.close();
  return ret;
}

module.exports = {
  getAllDaily,
  addDaily,
}

const main = async () => { 
  await addDaily(10, new Date());
}
main();