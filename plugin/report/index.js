const { scheduleJob, cancelJob } = require('node-schedule');
const { getWeekDaily, dailyDataArr2Msg, getWeekDailySum } = require('../daily/service/dailyService');


module.export = opts => {
  return ({ ws, http }) => { 
    scheduleJob("0 0 23 * * ? ", async function () {
      const weeklyMsg = dailyDataArr2Msg(await getWeekDaily());
      const weeklySumMsg = `本周盈亏：${await getWeekDailySum()}`;
      ws.send('send_private_msg', {
        user_id: data.sender.user_id,
        message: `${weeklyMsg}\n${weeklySumMsg}`
      })
    })
  }
}