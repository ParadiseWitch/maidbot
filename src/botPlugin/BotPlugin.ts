import { HTTP, WS } from "../bot/type";
import { MsgEventData } from "../type/EventData";
import PluginExecParam, { Handler, TaskList } from "./type";


export enum BotPluginType {
  // 回复型
  reply = "reply",
  // 启动型，主动型
  init = "init",
}

// 插件配置选项接口
export interface BotPluginOption {

}


export class BotPlugin {
  private _name: string;
  private _type: BotPluginType;
  private _enable: boolean;
  private _opt: BotPluginOption;
  private _handlers: Handler[];
  private _taskList: TaskList = {};

  constructor(
    name: string,
    type: BotPluginType = BotPluginType.reply,
    enable: boolean = true,
    opt: BotPluginOption = {},
  ) {
    this._name = name;
    this._type = type;
    this._enable = enable;
    this._opt = opt;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get type(): BotPluginType {
    return this._type;
  }
  public set type(value: BotPluginType) {
    this._type = value;
  }
  public get enable(): boolean {
    return this._enable;
  }
  public set enable(value: boolean) {
    this._enable = value;
  }
  public get opt(): BotPluginOption {
    return this._opt;
  }
  public set opt(value: BotPluginOption) {
    this._opt = value;
  }
  public get handlers(): Handler[] {
    return this._handlers;
  }
  public set handlers(value: Handler[]) {
    this._handlers = value;
  }
  public addTask(name: string, exec: () => Promise<any>) {
    this._taskList[name] = exec;
  }

  public deleteTask(name: string) {
    delete this._taskList[name];
  }

  public execTask(name: string): Promise<any> {
    return this._taskList[name]();
  }

  public execTaskList(): Promise<any> {
    let taskArr: {
      name: string,
      exec: () => Promise<any>
    }[] = [];
    for (const name in this._taskList) {
      if (Object.prototype.hasOwnProperty.call(this._taskList, name)) {
        const exec = this._taskList[name];
        taskArr.push({ name, exec })
      }
    }
    let results: {
      name: string,
      result: any,
      error: Error
    }[] = [];
    return Promise.all(taskArr.map(e => {
      const name = e.name;
      return e.exec().then(res => {
        console.log("task result:" + res);
        results.push({ name, result: res, error: null });
      }).catch(err => {
        results.push({ name, result: null, error: err });
      })
    })).then(res => results).catch(console.error)
  }

  public addHandler(handler: Handler) {
    const isExist = this.handlers.some(h => h.name === handler.name);
    if (!isExist) {
      this.handlers.push(handler);
    }
  }

  public addHandlers(handlers: Handler[]) {
    handlers.forEach(this.addHandler)
  }
  public handle({ ws, http, data }: PluginExecParam): Promise<any> {
    if (!this.enable) return;
    if (this.type === BotPluginType.reply) {
      // TODO 如果消息为''？
      if (!data || !data.message) return;
    }
    this.handlers.forEach(handler => { 
      if (handler.match(data)) { 
        handler.handle({ ws, http, data })
      }
    })
  }
}
