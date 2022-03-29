const dailyHandlers = require("./handler.js");

module.exports = opts => {
  return async ({ data, ws, http }) => {
    if (!data.message) return;
    if (data.message_type !== 'private') return;
    if (data.message.indexOf('打卡') === -1) return;
    const handlers = dailyHandlers.filter(handler => handler.match(data));
    if (handlers.length <= 0) { 
      await dailyHandlers[0].handle({ data, ws, http });
      return;
    }
    handlers.forEach(handler => handler.handle({ data, ws, http }));
  }
}