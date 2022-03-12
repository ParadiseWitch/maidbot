const { getChinaTime } = require("../../utils/DateUtil");
const { getWeekDaily, updateDailyByDate, getDailyByDate, getWeekSum, getSum } = require("./service/dailyService");


module.export = dailyHandlers = [
  {
    match: (data) => data.message.indexOf('帮助') !== -1 
      || data.message.indexOf('help') !== -1,
    handle: async (data, ws, http) => { 
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
      await addDaily();
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: '打卡成功\n' + await getWeekDailyMsg()
      })
    }
  },
  {
    match: (data) => data.message.indexOf('周') !== -1,
    handle: async ({ data, ws, http }) => {
      const weeklyMsg = await getWeekDailyMsg();
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
        date = getChinaTime(new Date(args[0]));
      } catch (error) {
        ws.send('send_private_msg', {
          user_id: data.sender.user_id,
          message: '日期参数格式错误, 格式示例: 2022/1/1'
        })
        return;
      }
      let money = args[1];
      await updateDailyByDate(date, money);
      const msg = await getDailyMsgByDate(date);
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
      await updateDailyByDate(date, money);
      const msg = await getDailyMsgByDate(date);
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
      const sum = await getSum();
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `全部盈亏：${msg}`
      })
    }
  }
]

const getWeekDailyMsg = async () => {
  const datas = await getWeekDaily();
  let msg = '';
  for (const data of datas) {
    for (const k in data) {
      if (Object.hasOwnProperty.call(data, k)) {
        const v = data[k];
        msg += `${v}\t`;
      }
    }
    msg += '\n';
  }
  return msg;
}

const getDailyMsgByDate = async (date) => {
  const datas = await getDailyByDate(date);
  const datas = await getWeekDaily();
  let msg = '';
  for (const data of datas) {
    for (const k in data) {
      if (Object.hasOwnProperty.call(data, k)) {
        const v = data[k];
        msg += `${v}\t`;
      }
    }
    msg += '\n';
  }
  return msg;
}