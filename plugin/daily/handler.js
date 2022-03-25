const {
  getDateStr,
} = require("../../utils/DateUtil");
const {
  getWeekDaily,
  updateDailyByDate,
  getDailyByDate,
  getWeekSum,
  getSum,
  addDaily
} = require("./service/dailyService");


const dailyHandlers = [
  {
    match: (data) => data.message.indexOf('帮助') !== -1
      || data.message.indexOf('help') !== -1,
    handle: async ({ data, ws, http }) => {
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `
        打卡命令：
          \t打卡
          \t打卡周榜
          \t更新打卡 [日期] [金额]
          \t查询打卡 [日期]
          \t打卡盈亏
        `
      })
    }
  },
  {
    match: (data) => data.message === '打卡',
    handle: async ({ data, ws, http }) => {
      const { exist } = await addDaily();
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: (exist ? '今日已打卡\n' : '打卡成功\n') + dailyDataArr2Msg(await getWeekDaily())
      })
    }
  },
  {
    match: (data) => data.message.indexOf('周') !== -1,
    handle: async ({ data, ws, http }) => {
      const weeklyMsg = dailyDataArr2Msg(await getWeekDaily());
      const weeklySumMsg = `本周盈亏：${await getWeekSum()}`;
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `${weeklyMsg}\n${weeklySumMsg}`
      })
    }
  },
  {
    match: (data) => data.message.indexOf('更新') !== -1 || data.message.indexOf('修改') !== -1,
    handle: async ({ data, ws, http }) => {
      const [command, ...args] = data.message.split(" ");
      if (args.length < 2) {
        ws.send('send_private_msg', {
          user_id: data.sender.user_id,
          message: '参数格式错误, 格式: 更新打卡 [日期] [金额]'
        })
        return;
      }
      let date;
      try {
        date = new Date(args[0]);
      } catch (error) {
        ws.send('send_private_msg', {
          user_id: data.sender.user_id,
          message: '日期参数格式错误, 格式示例: 2022/1/1'
        })
        return;
      }
      let money = parseInt(args[1]);
      const oldDataArr = await getDailyByDate(date);
      if (oldDataArr && oldDataArr.length > 0) {
        await updateDailyByDate(date, money);
      } else {
        await addDaily(date, money);
      }
      const msg = dailyDataArr2Msg(oldDataArr);
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `更新成功！\n${msg}`
      })
    }
  },
  {
    match: (data) => data.message.indexOf('查询') !== -1,
    handle: async ({ data, ws, http }) => {
      const [command, ...args] = data.message.split(" ");
      if (args.length < 1) {
        ws.send('send_private_msg', {
          user_id: data.sender.user_id,
          message: '参数格式错误, 格式: 查询打卡 [日期]'
        })
        return;
      }
      const date = args[0];
      const msg = dailyDataArr2Msg(await getDailyByDate(date));
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `${msg}`
      })
    }
  },
  {
    match: (data) => data.message.indexOf('余额') !== -1
      || data.message.indexOf('盈亏') !== -1,
    handle: async ({ data, ws, http }) => {
      const msg = await getSum();
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `全部盈亏：${msg}`
      })
    }
  }
]


const getDailyMsgByDate = async (dateStr) => {
  const date = new Date(dateStr);
  const datas = await getDailyByDate(date);
  let msg = '';
  for (const data of datas) {
    const { date, money, name } = data;
    msg += getDateStr(date) + '\t'
    msg += name + '\t';
    msg += money + '\n';
  }
  return msg;
}

/**
 * 将daily数组数据转为消息
 * @param {[]} datas 
 */
const dailyDataArr2Msg = (dataArr) => {
  let msg = '';
  for (const data of dataArr) {
    const { date, money, name } = data;
    msg += getDateStr(date) + '\t'
    msg += name + '\t';
    msg += money + '\n';
  }
  return msg;
}

module.exports = dailyHandlers;