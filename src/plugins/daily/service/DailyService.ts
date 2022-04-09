import { MongoClient } from 'mongodb';
import CONFIG from '../../../../config';
import { now, getThisWeekMonday, get0ClockDate, getDateStr } from '../../../utils/DateUtil';

const DB_NAME = 'todo';
const DAILY_COLLECTION_NAME = 'daily';
let client = null;
let db = null;
let dailyCol = null;

export const connectTodoDb = async () => {
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

export const exec = async (fn, ...arg) => {
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


export const getAllDaily = async (uid: number) => {
  return await exec(async () => await dailyCol.find({user: uid}).toArray());
}

export const getDailyByDate = async (uid: number, date: Date) => {
  return await exec(async () => await dailyCol.find({ user: uid, date }).toArray())
}

export const getLastDaily = async (uid: number) => {
  return await exec(async () => dailyCol.find({user: uid}).sort({ $natural: -1 }).limit(1).toArray());
}

export const getWeekDailies = async (uid: number) => {
  return await exec(async () => await dailyCol.find({
    "user": uid,
    "date": {
      $gte: getThisWeekMonday(),
      $lt: now()
    }
  }).toArray())

}

/**
 * 添加打卡
 * @param {number} uid
 * @param {Date} date 
 * @param {number} money 
 * @returns {Promise<{exist, data}>} promise
 */
export const addDaily = async (uid: number, date: Date = get0ClockDate(), money: number = 10) => {
  // 查询是否已经打卡
  date = get0ClockDate(date);
  const data = await getDailyByDate(uid, date);
  if (!data || data.length <= 0) {
    // 没有打卡, 插入数据
    const ret = await exec(async () => await dailyCol.insertOne({
      date: date,
      money: money,
      user: uid,
      name: 'daily'
    }));
    return Promise.resolve({ exist: false, data: ret })
  } else {
    return Promise.resolve({ exist: true, data: null })
  }
}

export const updateDailyByDate = async (uid: number, date: Date = get0ClockDate(), money: number = 10) => {
  return await exec(async () => await dailyCol.updateOne({ 
    'user': uid,
    'date': date 
  }, { 
    $set: { 
      'money': money, 
      'date': date 
    } 
  }));
}

/**
 * 获取本周的收益和
 * @param {*} uid 
 * @returns 
 */
export const getWeekDailySum = async (uid: number) => {
  return await exec(async () => await dailyCol.aggregate([
    {
      $match: {
        user: uid,
        date: {
          $gte: getThisWeekMonday(),
          $lt: now()
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

/**
 * 获取总共的收益和
 */

export const getDailySum = async (uid: number) => {
  return await exec(async () => await dailyCol.aggregate([
    { $match: { user: uid } },
    {
      $group: {
        _id: null,
        total: { $sum: '$money' }
      }
    }
  ]).toArray()).then(res => res.length ? res[0].total : 0);
}




/**
 * 将daily数组数据转为消息
 * @param {[]} dataArr
 */
export const dailyDataArr2Msg = (dataArr: any[]) => {
  let msg = '';
  dataArr.sort((a, b) => a.date - b.date)
  for (const data of dataArr) {
    const { date, money, name } = data;
    msg += getDateStr(date) + '\t'
    msg += name + '\t';
    msg += money + '\n';
  }
  return msg;
}
