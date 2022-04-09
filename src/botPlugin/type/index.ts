import { HTTP, WS } from "../../bot/type";
import { MsgEventData } from "../../type/EventData";



export type TaskList = {
  [name: string]: () => Promise<any>
}

export type Handler = {
  name: string;
  // 用于匹配错误
  match: (data?: MsgEventData) => boolean;
  // 用于处理错误
  handle: (params: { data?: MsgEventData, ws: WS, http: HTTP }) => any;
}

export default interface PluginExecParam {
  ws: WS,
  http: HTTP,
  data?: MsgEventData,
}