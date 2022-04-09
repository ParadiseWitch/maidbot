import { BotPlugin } from "./BotPlugin";

export class BotPluginManager {
  private static _instance: BotPluginManager = new BotPluginManager();7
  private static _botPlugins: BotPlugin[] = [];
  public static get botPlugins(): BotPlugin[] {
    return BotPluginManager._botPlugins;
  }
  public static set botPlugins(value: BotPlugin[]) {
    BotPluginManager._botPlugins = value;
  }
  private constructor() {
    BotPluginManager._instance = this;
  }

  public static getInstace() {
    if (BotPluginManager._instance) { 
      return BotPluginManager._instance;
    }
    return new BotPluginManager();
  }

  public static registBotPlugin(botPlugin: BotPlugin) {
    const plugins = BotPluginManager.botPlugins
    const pluginIsExist = plugins.some(
      p => p.name === botPlugin.name);
    if (!pluginIsExist) { 
      BotPluginManager.botPlugins.push(botPlugin);
    }
  }

  public static registBotPlugins(botPlugins: BotPlugin[]) {
    botPlugins.forEach(BotPluginManager.registBotPlugin)
  }

  public static getBotPlugin(name: string): BotPlugin { 
    const plugins = BotPluginManager.botPlugins;
    return plugins.filter(p => p.name === name)[0];
  }

  public static disableBotPlugin(name: string) { 
    const p = BotPluginManager.getBotPlugin(name);
    p.enable = false;
  }
}