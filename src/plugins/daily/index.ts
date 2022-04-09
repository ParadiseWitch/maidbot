import { scheduleJob } from "node-schedule";
import { BotPlugin } from "../../botPlugin";
import { BotPluginType } from "../../botPlugin/BotPlugin";
import PluginExecParam, { Handler } from "../../botPlugin/type";
import { MsgEventData } from "../../type/EventData";
import { dailyHandlers } from "./handler/dailyHandler";


const dailyPlugin = new BotPlugin('daily', BotPluginType.reply, true, {});

const baseHandler: Handler = {
  name: "baseHandler",
  match: (data: MsgEventData) => { 
    const msg = data.message;
    if (data.message_type !== 'private') return false;
    if (msg.indexOf('打卡') === -1) return false;
    const handlers = dailyHandlers.filter(handler => handler.match(data));
    if (handlers.length <= 0) return false;
    return true;
  },
  handle: ({data, ws, http}: PluginExecParam) => { 
    dailyHandlers.forEach(handler => {
      if (handler.match(data)) {
        handler.handle({ data, ws, http })
      }
    })
  }
}

dailyPlugin.handlers = [baseHandler];
dailyPlugin.addTask("remind", () => {
  return new Promise((res, rej) => { 
    scheduleJob("0/5 * * * * ?", async function () {
      // console.log(getDateStr());
    })
  });
})
// dailyPlugin.execTaskList();


export default dailyPlugin;