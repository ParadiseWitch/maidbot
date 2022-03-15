const { addDaily, getWeekDaily } = require("./service/dailyService");
const dailyHandlers = require("./handler.js");

module.exports = opts => {
  return async ({ data, ws, http }) => {
    if (!data.message) return;
    if (data.message_type !== 'private') return;
    if (data.message.indexOf('打卡') === -1) return;
    const SENDER_ID = 1374624878;
    if (data.sender.user_id !== SENDER_ID) return;
    const handlers = dailyHandlers.filter(handler => handler.match(data));
    if (handlers.length <= 0) { 
      await dailyHandlers[0].handle({ data, ws, http });
      return;
    }
    handlers.forEach(handler => handler.handle({ data, ws, http }));
  }
}