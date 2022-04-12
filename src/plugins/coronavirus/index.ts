import PluginExecParam, { Handler } from "../../botPlugin/type";
import { BotPlugin } from "../../botPlugin";
import { BotPluginType } from "../../botPlugin/BotPlugin";
import { MsgEventData } from "../../type/EventData";
import virusHandlers from "./handler";

const virusPlugin = new BotPlugin('coronavirus', BotPluginType.reply, true, {});

const baseHandler: Handler = {
  name: "baseHandler",
  match: (data: MsgEventData) => {
    const msg = data.message;
    if (data.message_type !== 'private') return false;
    if (msg.indexOf('新冠') === -1 || msg.indexOf('疫情') === -1) return false;
    const handlers = virusHandlers.filter(handler => handler.match(data));
    if (handlers.length <= 0) return false;
    return true;
  },
  handle: ({ data, ws, http }: PluginExecParam) => {
    virusHandlers.forEach(handler => {
      if (handler.match(data)) {
        handler.handle({ data, ws, http })
      }
    })
  }
}

export default virusPlugin;