const {
  getDateStr,
} = require("../../utils/DateUtil");
const {
  getWeekDailies,
  updateDailyByDate,
  getDailyByDate,
  getWeekDailySum,
  getDailySum,
  addDaily,
  dailyDataArr2Msg,
} = require("./service/dailyService");
const { isAdmin } = require("../../utils/AppUtil")

const dailyHandlers = [
  {
    match: (data) => data.message.indexOf('帮助') !== -1
      || data.message.indexOf('help') !== -1,
    handle: sendHelpMsg
  },
  {
    match: (data) => data.message === '打卡',
    handle: dailyAndSendWeekDailies
  },
  {
    match: (data) => data.message.indexOf('周') !== -1,
    handle: sendWeekDailies
  },
  {
    match: (data) => data.message.indexOf('更新') !== -1 || data.message.indexOf('修改') !== -1,
    handle: updateDaily
  },
  {
    match: (data) => data.message.indexOf('查询') !== -1,
    handle: queryDaily
  },
  {
    match: (data) => data.message.indexOf('余额') !== -1
      || data.message.indexOf('盈亏') !== -1,
    handle: queryDailySumMoney
  }
]

/**
 * 获取帮助信息
 * @param {*} uid 
 * @returns 
 */
function getHelpMsg(uid) {
  return `打卡命令：
  \t打卡
  \t打卡周榜
  ${isAdmin(uid) ? '\t更新打卡 [日期] [金额]' : ''}
  \t查询打卡 [日期]
  \t打卡盈亏
  `
}

/**
 * 发送给用户帮助信息
 * @param {data, ws, http} param0 
 */
async function sendHelpMsg({ data, ws, http }) {
  const uid = data.sender.user_id;
  ws.send('send_private_msg', {
    user_id: uid,
    message: getHelpMsg(uid)
  });
};

/**
 * 用户打卡并发送每周打卡
 * @param {data, ws, http} param0 
 */
async function dailyAndSendWeekDailies({ data, ws, http }) {
  const sendUid = data.sender.user_id;
  const { exist } = await addDaily(sendUid);
  ws.send('send_private_msg', {
    user_id: sendUid,
    message: (exist ? '今日已打卡\n' : '打卡成功\n') + dailyDataArr2Msg(await getWeekDailies(sendUid))
  });
};

/**
 * 发送用户的每周打卡和每周盈亏
 * @param {data, ws, http} param0 
 */
async function sendWeekDailies({ data, ws, http }) {
  const sendUid = data.sender.user_id;
  const weeklyMsg = dailyDataArr2Msg(await getWeekDailies(sendUid));
  const weeklySumMsg = `本周盈亏：${await getWeekDailySum(sendUid)}`;
  ws.send('send_private_msg', {
    user_id: sendUid,
    message: `${weeklyMsg}\n${weeklySumMsg}`
  });
}


/**
 * 提取更新命令的参数并验证
 * @param {[]} args 
 * @returns 
 */
function extractUpdateArgsAndVaild(args) {
  if (args.length !== 3) {
    throw new Error('参数格式错误, 格式: 更新打卡 [用户QQ] [日期] [金额]')
  }
  let date;
  try {
    date = new Date(args[1]);
  } catch (error) {
    throw new Error('日期参数格式错误, 格式示例: 2022/1/1')
  }
  const uid = parseInt(args[0]);
  const money = parseInt(args[2]);
  return { uid, date, money }
}

/**
 * 更新打卡
 * @param {data, ws, http} param0 
 * @returns 
 */
async function updateDaily({ data, ws, http }) {
  const [command, ...args] = data.message.split(" ");
  const sendUid = data.sender.user_id;
  if (!isAdmin(sendUid)) {
    ws.send('send_private_msg', {
      user_id: sendUid,
      message: '此命令需要管理员权限'
    });
    return;
  }
  let uid, date, money;
  try {
    ({ uid, date, money } = extractUpdateArgsAndVaild(args));
  } catch (e) {
    ws.send('send_private_msg', {
      user_id: sendUid,
      message: e.message
    });
  }
  const oldDataArr = await getDailyByDate(uid, date);
  let isUpdate = true;
  if (oldDataArr && oldDataArr.length > 0) {
    await updateDailyByDate(uid, date, money);
  } else {
    isUpdate = false;
    await addDaily(uid, date, money);
  }
  const msg = dailyDataArr2Msg(await getDailyByDate(uid, date));
  ws.send('send_private_msg', {
    user_id: data.sender.user_id,
    message: `${isUpdate ? '更新成功！' : '插入成功'}\n${msg}`
  });
};

/**
 * 查询(自己)打卡
 * @param {data, ws, http} param0 
 * @returns 
 */
async function queryDaily({ data, ws, http }) {
  const [command, ...args] = data.message.split(" ");
  const sendUid = data.sender.user_id;
  if (args.length < 1) {
    ws.send('send_private_msg', {
      user_id: sendUid,
      message: '参数格式错误, 格式: 查询打卡 [日期]'
    });
    return;
  }
  const date = args[0];
  const msg = dailyDataArr2Msg(await getDailyByDate(sendUid, new Date(date)));
  ws.send('send_private_msg', {
    user_id: sendUid,
    message: `${(msg && msg.length > 0) ? msg : '无打卡数据'}`
  });
};

/**
 * 查询总盈亏
 * @param {data, ws, http} param0 
 */
async function queryDailySumMoney({ data, ws, http }) {
  const sendUid = data.sender.user_id;
  const msg = await getDailySum(sendUid);
  ws.send('send_private_msg', {
    user_id: data.sender.user_id,
    message: `全部盈亏：${msg}`
  });
};

module.exports = dailyHandlers;

// const main = async() => {
  //   const str = dailyDataArr2Msg(await getWeekDailies())
//   console.log(str);
// }
// main();