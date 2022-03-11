const { MongoClient } = require('mongodb');
const CONFIG = require('../../../config');
const { getChinaTime, getWeekAgo, getDate } = require('../../../utils/DateUtil');

const DB_NAME = 'todo';
const COLLECTION_NAME = 'daily';
let client;
let db;
let client;

const getDbConfig = async () => {
  try {
    if (!client || !db || !collection) {
      client = new MongoClient(CONFIG.db.mongo.url)
      await client.connect();
      db = client.db(DB_NAME);
      collection = db.collection(COLLECTION_NAME);
    }
  } catch (error) {
    console.error(error);
    client && client.close()
  }
}

const exec = async (fn, ...arg) => {
  try {
    return await fn(...arg);
  } catch (error) {
    console.error(error);
  } finally {
    client && client.close()
  }
}


const getAllDaily = async () => {
  const { collection } = await getDbConfig();
  return await exec(async () => await collection.find({}).toArray());
}

const getDailyByDate = async (date) => {
  const { client, db, collection } = await getDbConfig();
  return await exec(async () => await collection.find({ date }).toArray())
}

const getLastDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  return await exec(async () => collection.find({}).sort({ $natural: -1 }).limit(1).toArray());
}

const getWeekDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  return await exec(async () => await collection.find({
    "date": {
      $gte: getWeekAgo(),
      $lt: getChinaTime()
    }
  }).toArray())

}

/**
 * 添加打卡
 * @param {*} money 
 * @param {*} date 
 * @returns 
 */
const addDaily = async (date = getDate(), money = 10) => {
  const { client, db, collection } = await getDbConfig();
  // 查询是否已经打卡
  const data = await getDailyByDate(getDate(date));
  const len = data.length;
  if (len <= 0) {
    // 没有打卡, 插入数据
    return exec(async () => await collection.insertOne({
      date: date,
      money: money,
      user: 'xj',
      name: 'daily'
    }));
  } else {
    // 该日期已有打卡，更新
    await client.close();
    return await updateDailyByDate(getDate(date), 20)
  }
}

const updateDailyByDate = async (date = getDate(), money = 10) => {
  const { client, db, collection } = await getDbConfig();
  return await exec(async () => await collection.updateOne({ 'date': date }, { $set: { 'money': money, 'date': date } }));
}

const getSum = async () => {
  const { client, db, collection } = await getDbConfig();
  return await exec(async () => await collection.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$money' }
      }
    }
  ]).toArray());
}

const getWeekSum = async () => {
  const { client, db, collection } = await getDbConfig();
  return await exec(async () => await collection.aggregate([
    {
      $match: {
        "date": {
          $gte: getWeekAgo(),
          $lt: getChinaTime()
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$money' }
      }
    }
  ]).toArray());
}


module.exports = {
  getAllDaily,
  getLastDaily,
  addDaily,
  getDailyByDate,
  getWeekDaily
}

const main = async () => {
  console.log(await getWeekDaily())
}
main();