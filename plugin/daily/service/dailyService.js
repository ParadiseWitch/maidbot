const { MongoClient } = require('mongodb');
const CONFIG = require('../../../config');
const { getChinaTime, getWeekAgo, get0ClockDate } = require('../../../utils/DateUtil');

const DB_NAME = 'todo';
const DAILY_COLLECTION_NAME = 'daily';
let client = null;
let db = null;
let dailyCol = null;

const connectTodoDb = async () => {
  try {
    if (!client || !db || !dailyCol) {
      client = new MongoClient(CONFIG.db.mongo.url)
      await client.connect();
      db = client.db(DB_NAME);
      dailyCol = db.collection(DAILY_COLLECTION_NAME);
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
    client = null;
  }
}


const getAllDaily = async () => {
  await connectTodoDb();
  return await exec(async () => await dailyCol.find({}).toArray());
}

const getDailyByDate = async (date) => {
  await connectTodoDb();
  return await exec(async () => await dailyCol.find({ date }).toArray())
}

const getLastDaily = async () => {
  await connectTodoDb();
  return await exec(async () => dailyCol.find({}).sort({ $natural: -1 }).limit(1).toArray());
}

const getWeekDaily = async () => {
  await connectTodoDb();
  return await exec(async () => await dailyCol.find({
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
const addDaily = async (date = get0ClockDate(), money = 10) => {
  await connectTodoDb();
  // 查询是否已经打卡
  const data = await getDailyByDate(get0ClockDate(date));
  const len = data.length;
  if (len <= 0) {
    // 没有打卡, 插入数据
    return exec(async () => await dailyCol.insertOne({
      date: date,
      money: money,
      user: 'xj',
      name: 'daily'
    }));
  } else {
    // 该日期已有打卡，更新
    await client.close();
    return await updateDailyByDate(get0ClockDate(date), 20)
  }
}

const updateDailyByDate = async (date = get0ClockDate(), money = 10) => {
  await connectTodoDb();
  return await exec(async () => await dailyCol.updateOne({ 'date': date }, { $set: { 'money': money, 'date': date } }));
}

const getSum = async () => {
  await connectTodoDb();
  return await exec(async () => await dailyCol.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$money' }
      }
    }
  ]).toArray()).then(res => res[0].total);
}

const getWeekSum = async () => {
  await connectTodoDb();
  return await exec(async () => await dailyCol.aggregate([
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
  ]).toArray()).then(res => res[0].total);
}


module.exports = {
  getAllDaily,
  getLastDaily,
  addDaily,
  getDailyByDate,
  getWeekDaily,
  updateDailyByDate,
  getWeekSum,
  getSum,
}

// const main = async () => {
//   console.log(await getWeekSum());
// }
// main();