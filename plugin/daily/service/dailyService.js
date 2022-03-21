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
    await connectTodoDb();
    return await fn(...arg);
  } catch (error) {
    console.error(error);
  } finally {
    client && client.close()
    client = null;
  }
}


const getAllDaily = async () => {
  return await exec(async () => await dailyCol.find({}).toArray());
}

const getDailyByDate = async (date) => {
  return await exec(async () => await dailyCol.find({ date }).toArray())
}

const getLastDaily = async () => {
  return await exec(async () => dailyCol.find({}).sort({ $natural: -1 }).limit(1).toArray());
}

const getWeekDaily = async () => {
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
  // 查询是否已经打卡
  date = get0ClockDate(date);
  const data = await getDailyByDate(date);
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
    return await updateDailyByDate(date, money)
  }
}

const updateDailyByDate = async (date = get0ClockDate(), money = 10) => {
  return await exec(async () => await dailyCol.updateOne({ 'date': date }, { $set: { 'money': money, 'date': date } }));
}

const getSum = async () => {
  return await exec(async () => await dailyCol.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$money' }
      }
    }
  ]).toArray()).then(res => res.alength ? res[0].total : 0);
}

const getWeekSum = async () => {
  // FIXME 时间范围应该是本周周一到目前天的范围
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
  ]).toArray()).then(res => res.length ? res[0].total : 0);
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

const main = async () => {
  console.log(await getSum());
}
main();