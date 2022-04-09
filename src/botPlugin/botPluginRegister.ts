import { BotPluginManager } from "./BotPluginManager";

const PLUGINS_RELATIVE_PATH = "../plugins";

export const botPluginRegister = async () => { 
  return await import(PLUGINS_RELATIVE_PATH).then(pluginObj => { 
    const plugins = [];
    for (const key in pluginObj) {
      if (Object.prototype.hasOwnProperty.call(pluginObj, key)) {
        plugins.push(pluginObj[key]);
      }
    }
    console.log(plugins);
    BotPluginManager.registBotPlugins(plugins)
  })
}