const { addDaily, getWeekDaily } = require("./service/dailyService");

module.exports = opts => {
  return async ({ data, ws, http }) => {
    if (!data.message) return;
    if (data.message_type !== 'private') return;
    if (data.message.indexOf('打卡') === -1) return;
    const SENDER_ID = 1374624878;
    if (data.sender.user_id !== SENDER_ID) return;

  }
}