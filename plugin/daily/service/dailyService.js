const { MongoClient } = require('mongodb');
const CONFIG = require('../../../config');
const { getChinaTime, getWeekAgo, getDate } = require('../../../utils/DateUtil');

const DB_NAME = 'todo';
const COLLECTION_NAME = 'daily';

const getDbConfig = async () => {
  let client;
  try {
    client = new MongoClient(CONFIG.db.mongo.url)
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    return { client, db, collection };
  } catch (error) {
    console.error(error);
    client.close();
  }
}

const getAllDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.find({}).toArray();
  } catch (error) {
    console.error(error)
  } finally {
    await client.close();
  }
  return ret;
}

const getDailyByDate = async (date) => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.find({ date }).toArray();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  return ret;
}

const getLastDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.find({}).sort({ $natural: -1 }).limit(1).toArray();
  } catch (error) {
    console.error(error)
  } finally {
    await client.close();
  }
  return ret;
}

const getWeekDaily = async () => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.find({
      "date": {
        $gte: getWeekAgo(),
        $lt: getChinaTime()
      }
    }).toArray();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  return ret;
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
    let ret;
    try {
      ret = await collection.insertOne({
        date: date,
        money: money,
        user: 'xj',
        name: 'daily'
      });
    } catch (e) {
      console.error(e)
    } finally {
      await client.close();
    }
    return ret;
  } else {
    // 该日期已有打卡，更新
    await client.close();
    return await updateDailyByDate(getDate(date), 20)
  }
}

const updateDailyByDate = async (date = getDate(), money = 10) => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.updateOne({ 'date': date }, { $set: { 'money': money, 'date': date } });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close()
  }
  return ret;
}

const getSum = async () => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$money' }
        }
      }
    ]).toArray();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  return ret;
}

const getWeekSum = async () => {
  const { client, db, collection } = await getDbConfig();
  let ret;
  try {
    ret = await collection.aggregate([
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
    ]).toArray();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  return ret;
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